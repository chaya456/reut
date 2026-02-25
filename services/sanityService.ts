import { AppContent } from '../types';

const PROJECT_ID = 's42jv3ts';
const DATASET = 'production';
const API_VERSION = '2023-05-03';

// ניקוי אגרסיבי של הטוקן מכל רווח או תו נסתר
const getCleanToken = () => {
  const token = import.meta.env.VITE_SANITY_TOKEN;
  if (!token) return '';
  return String(token).replace(/\s+/g, '').trim();
};

const TOKEN = getCleanToken();
const BASE_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data`;

export const saveContentToSanity = async (content: AppContent) => {
  if (!TOKEN) {
    console.error('❌ חסר טוקן של Sanity');
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/mutate/${DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
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
  if (!TOKEN) return null;
  try {
    const query = encodeURIComponent('*[_id == "siteContent"][0]');
    const response = await fetch(`${BASE_URL}/query/${DATASET}?query=${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    const data = json.result;

    if (data) {
      const { _id, _type, _createdAt, _updatedAt, _rev, ...content } = data;
      return content as AppContent;
    }
    return null;
  } catch (error: any) {
    console.error('❌ שגיאת טעינה מ-Sanity:', error);
    if (error.message === 'Failed to fetch') {
      console.warn('💡 שגיאת CORS: חובה לאשר את כתובת האתר בלוח הבקרה של Sanity (manage.sanity.io)');
    }
    return null;
  }
};

