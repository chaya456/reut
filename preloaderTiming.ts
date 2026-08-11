// תיאום תזמון בין מסך הטעינה (Preloader) לחלוניות הקופצות.
// המטרה: החלוניות יופיעו רק אחרי שמסך הטעינה נעלם והאתר כבר גלוי — לא לפני.

export const PRELOADER_DURATION = 5000; // משך מסך הטעינה (מ"ש)
export const PRELOADER_FADE = 600;      // משך אנימציית ההיעלמות (מ"ש)
export const PRELOADER_DONE_EVENT = 'reut:preloader-done';

declare global {
  interface Window {
    __reutPreloaderDone?: boolean;
  }
}

// נקרא ע"י מסך הטעינה ברגע שהוא סיים ונעלם.
export function markPreloaderDone(): void {
  window.__reutPreloaderDone = true;
  window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
}

// מריץ את cb לאחר שמסך הטעינה הסתיים + השהיה נוספת של delay מ"ש.
// אם הטעינה כבר הסתיימה — מתחיל למנות מיד. מחזיר פונקציית ניקוי.
export function runAfterPreloader(delay: number, cb: () => void): () => void {
  let timer: number | undefined;
  const start = () => { timer = window.setTimeout(cb, delay); };

  if (window.__reutPreloaderDone) {
    start();
    return () => { if (timer !== undefined) clearTimeout(timer); };
  }

  const onDone = () => start();
  window.addEventListener(PRELOADER_DONE_EVENT, onDone, { once: true });

  return () => {
    window.removeEventListener(PRELOADER_DONE_EVENT, onDone);
    if (timer !== undefined) clearTimeout(timer);
  };
}
