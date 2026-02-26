import { AppContent } from '../types';

const PROJECT_ID = 's42jv3ts';
const DATASET = 'production';
const API_VERSION = '2023-05-03';

// פונקציה ששואבת את הטוקן *בזמן אמת* כדי לא לפספס את ה-Apply
const getActiveToken = () => {
  const token = import.meta.env.VITE_SANITY_TOKEN;
  return token ? String(token).replace(/\s+/g, '').trim() : '';
};

const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`;

export const saveContentToSanity = async (content: AppContent) => {
  const token = getActiveToken();
  if (!token) {
    console.error('❌ חסר טוקן של Sanity');
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/mutate/${DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mutations: [
          {
            createOrReplace: {
              _id: 'siteContent',
              _type: 'siteContent',
              ...content
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log('✅ נשמר ב-Sanity בהצלחה');
  } catch (error: any) {
    console.error('❌ שגיאת שמירה ב-Sanity:', error);
    if (error.message === 'Failed to fetch') {
      console.warn('💡 שגיאת CORS: חובה לאשר את כתובת האתר בלוח הבקרה של Sanity (manage.sanity.io)');
    }
  }
};

export const loadContentFromSanity = async (): Promise<AppContent | null> => {
  const token = getActiveToken();
  if (!token) return null; // אם אין טוקן, נשארים במצב מקומי

  try {
    const query = encodeURIComponent('*[_id == "siteContent"][0]');
    const response = await fetch(`${BASE_URL}/query/${DATASET}?query=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.result || null;
  } catch (error) {
    return null;
  }
};

// פונקציית בדיקה שתקפוץ לך על המסך
export const testConnection = async () => {
  const token = getActiveToken();
  if (!token) {
    alert("❌ חובה ללחוץ על Apply בחלונית ה-Secrets!");
    return;
  }
  const url = `${BASE_URL}/query/${DATASET}?query=count(*[_type == "siteContent"])`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) alert("✅ הקשר עם Sanity נוצר בהצלחה!");
    else alert("❌ שגיאת התחברות: " + res.status);
  } catch (e) {
    alert("❌ שגיאת רשת - בדקי CORS");
  }
};