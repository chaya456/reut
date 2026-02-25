import { createClient } from '@sanity/client';
import { AppContent } from '../types';

/**
 * פונקציית עזר לניקוי תווים שאינם ASCII ממשתני סביבה
 * מונע שגיאות ISO-8859-1 ורווחים בלתי נראים
 */
const cleanEnvVar = (val: any): string => {
  if (!val || typeof val !== 'string') return '';
  return val.trim().replace(/[^\x20-\x7E]/g, '');
};

const PROJECT_ID = 's42jv3ts';
const DATASET = 'production';
const TOKEN = cleanEnvVar(import.meta.env.VITE_SANITY_TOKEN);

// יצירת הלקוח רק אם יש טוקן, עם הגדרה ידנית של ה-Host למניעת שגיאות URL
export const sanityClient = TOKEN ? createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: TOKEN,
  apiHost: `https://${PROJECT_ID}.api.sanity.io`,
  useProjectHostname: false,
}) : null;

export const saveContentToSanity = async (content: AppContent) => {
  if (!sanityClient) return;
  try {
    await sanityClient.createOrReplace({
      _id: 'siteContent',
      _type: 'siteContent',
      ...content
    });
    console.log('✅ נשמר ב-Sanity בהצלחה');
  } catch (error: any) {
    console.error('❌ שגיאת שמירה ב-Sanity:', error);
    if (error.message && error.message.includes('fetch')) {
      console.warn('💡 טיפ: וודאי שהכתובת של האתר נוספה ל-CORS ב-Sanity (manage.sanity.io)');
    }
  }
};

export const loadContentFromSanity = async (): Promise<AppContent | null> => {
  if (!sanityClient) return null;
  try {
    const data = await sanityClient.fetch(`*[_id == "siteContent"][0]`);
    if (data) {
      const { _id, _type, _createdAt, _updatedAt, _rev, ...content } = data;
      return content as AppContent;
    }
    return null;
  } catch (error: any) {
    console.error('❌ שגיאת טעינה מ-Sanity:', error);
    if (error.message && error.message.includes('fetch')) {
      console.warn('💡 טיפ: וודאי שהכתובת של האתר נוספה ל-CORS ב-Sanity (manage.sanity.io)');
    }
    return null;
  }
};
