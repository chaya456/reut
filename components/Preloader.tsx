import React, { useEffect, useState } from 'react';
import { PRELOADER_DURATION, PRELOADER_FADE, markPreloaderDone } from '../preloaderTiming';

// מסך טעינה קצר בכניסה לאתר — מציג את הלוגו המונפש בזמן שהתמונות נטענות ברקע,
// ואז נעלם בהדרגה. מוצג פעם אחת בכל טעינת עמוד מלאה.
const Preloader: React.FC = () => {
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // מונעים גלילה בזמן הטעינה
    document.body.style.overflow = 'hidden';

    const fadeTimer = setTimeout(() => setFadingOut(true), PRELOADER_DURATION);
    const hideTimer = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = '';
      // מסמנים שהטעינה הסתיימה — כדי שהחלוניות הקופצות יתחילו למנות רק עכשיו.
      markPreloaderDone();
    }, PRELOADER_DURATION + PRELOADER_FADE);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-brand-soft transition-opacity duration-[600ms] ease-out"
      style={{ opacity: fadingOut ? 0 : 1, pointerEvents: fadingOut ? 'none' : 'auto' }}
      aria-hidden="true"
    >
      {/* הלוגו המונפש — mix-blend-mode: multiply מוחק את הרקע הלבן של ה-GIF
          כך שרקע המותג נראה מבעד ללוגו (במקום ריבוע לבן). */}
      <img
        src="/logo-animated.gif"
        alt="ערך מוסף"
        className="w-[min(42vw,230px)] h-auto"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* סלוגן */}
      <p className="mt-2 text-brand-dark font-extrabold text-[clamp(18px,3.4vw,26px)] tracking-tight">
        מוסיפה ערך למוצר
      </p>

      {/* פס התקדמות דק שמתמלא לאורך זמן הטעינה */}
      <div className="mt-7 w-40 h-[3px] bg-brand-light/40 rounded-full overflow-hidden">
        <div className="h-full bg-brand-dark rounded-full animate-[loadBar_5s_linear_forwards]"></div>
      </div>

      <style>{`
        @keyframes loadBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
