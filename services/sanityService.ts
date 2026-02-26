import { AppContent } from '../types';

const PROJECT_ID = 's42jv3ts'; //
const DATASET = 'production'; //
const API_VERSION = '2023-05-03';

// פונקציה ששואבת את הטוקן *בזמן אמת* בכל פעם שצריך אותו
const getActiveToken = () => {
  const rawToken = import.meta.env.VITE_SANITY_TOKEN; //
  if (!rawToken) return '';
  return String(rawToken).replace(/\s+/g, '').trim();
};

const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`;

export const loadContentFromSanity = async (): Promise<AppContent | null> => {
  const token = getActiveToken();
  if (!token) {
    console.warn('⚠️ לא נמצא טוקן בסביבת העבודה - עובר למצב מקומי');
    return null;
  }

  try {
    const query = encodeURIComponent('*[_id == "siteContent"][0]');
    const response = await fetch(`${BASE_URL}/query/${DATASET}?query=${query}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    
    // אם החיבור הצליח אבל אין מסמך siteContent בסניטי
    if (!json.result) {
       console.log('ℹ️ החיבור עובד, אך לא נמצא מסמך בשם siteContent בסניטי');
       return null;
    }

    const { _id, _type, _createdAt, _updatedAt, _rev, ...content } = json.result;
    return content as AppContent;
  } catch (error: any) {
    console.error('❌ שגיאת טעינה:', error.message);
    return null;
  }
};

export const saveContentToSanity = async (content: AppContent) => {
  const token = getActiveToken();
  if (!token) return alert('❌ חובה להזין ולהחיל (Apply) את הטוקן ב-Secrets');

  try {
    const response = await fetch(`${BASE_URL}/mutate/${DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: { _id: 'siteContent', _type: 'siteContent', ...content } }]
      })
    });

    if (response.ok) alert('✅ השינויים נשמרו ב-Sanity בהצלחה!');
    else throw new Error(await response.text());
  } catch (error: any) {
    alert('❌ שגיאת שמירה: ' + error.message);
  }
};