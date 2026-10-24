import imageMap from '../data/imageMap';

/**
 * מחזיר גרסה קלה של תמונה כדי שהאתר ייטען מהר:
 *  - תמונות postimg מוכרות → עותק webp מוקטן שיושב באתר עצמו (public/img).
 *  - תמונות שהועלו ל-Cloudinary מלוח הבקרה → Cloudinary מקטין וממיר אוטומטית.
 *  - כל השאר → הכתובת המקורית, בלי שינוי.
 * size: 'sm' לכרטיסים/תמונות קטנות, 'lg' לתמונות גדולות (הירו, תצוגה מלאה).
 */
export const optimizeImg = (url: string | undefined, size: 'sm' | 'lg' = 'sm'): string => {
  if (!url) return '';
  const local = imageMap[url];
  if (local) return local[size];

  // Cloudinary: מוסיפים הקטנה + פורמט אוטומטי (עובד גם בחשבון החינמי, לתמונות שהועלו)
  const m = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!.*\bw_\d)(.*)$/);
  if (m) return `${m[1]}f_auto,q_auto,w_${size === 'lg' ? 1600 : 720}/${m[2]}`;

  return url;
};
