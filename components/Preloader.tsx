import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Logo from './Logo';
import { PRELOADER_DURATION, PRELOADER_FADE, markPreloaderDone } from '../preloaderTiming';

// מסך טעינה בכניסה לאתר (לפי בקשת רעות):
// הכתב "רעות" מצטייר בקו ואז מתמלא, הנקודה נופלת וקופצת כמו כדור,
// לבבונים מתפזרים והלוגו רוקד "ג'לי". הסלוגן נכנס מענק, צמוד, ונשאר גדול,
// והלבבון קופץ בסוף "הערך שלנו".

// מסך הטעינה מוצג רק בכניסה הראשונה לאתר (נשמר בדפדפן), ולא בכל מעבר בין עמודים או ביקור חוזר.
const SEEN_KEY = 'reutPreloaderSeen';
const alreadySeen = () => {
  // ?intro בכתובת מציג את מסך הטעינה שוב (לצפייה ובדיקה)
  if (new URLSearchParams(window.location.search).has('intro')) return false;
  try { return localStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
};

const SPARKS = 8; // לבבונים קטנים שמתפזרים כשהכדור נוחת

const Preloader: React.FC = () => {
  const [skip] = useState(alreadySeen);
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(skip);
  const rootRef = useRef<HTMLDivElement>(null);

  // תזמון כללי: הצגה, היעלמות ושחרור החלוניות הקופצות
  useEffect(() => {
    if (skip) {
      markPreloaderDone();
      return;
    }
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* גלישה פרטית — לא קריטי */ }

    document.body.style.overflow = 'hidden';
    const fadeTimer = setTimeout(() => setFadingOut(true), PRELOADER_DURATION);
    const hideTimer = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = '';
      markPreloaderDone();
    }, PRELOADER_DURATION + PRELOADER_FADE);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = '';
    };
  }, []);

  // ההנפשה עצמה (GSAP), מוגבלת לתוך מסך הטעינה בלבד
  useLayoutEffect(() => {
    if (skip || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGPathElement>('.pre-logo #logo-character path');
      const ball = '.pre-logo #logo-ball';

      gsap.set('.pre-logo', { opacity: 1 });
      // כל משיכה מתחילה כקו מתאר "שמצטייר", בלי מילוי
      strokes.forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, {
          attr: { stroke: 'currentColor', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
          fillOpacity: 0,
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });
      gsap.set(ball, { transformOrigin: '50% 100%', y: -340, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });

      // 1. הכתב "רעות" מצטייר בקו, כאילו כותבים אותו ביד
      tl.to(strokes, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.22 });

      // 2. המילוי "נשפך" פנימה והקו נעלם — עם קפיצה קטנה של כל הלוגו
      tl.to(strokes, { fillOpacity: 1, duration: 0.45, ease: 'power1.out', stagger: 0.06 }, 1.05)
        .to(strokes, { attr: { 'stroke-width': 0 }, duration: 0.4 }, 1.25)
        .fromTo('.pre-logo', { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }, 1.15);

      // 3. הנקודה נופלת מלמעלה, נמעכת בנחיתה וקופצת כמו כדור
      tl.addLabel('drop', 1.35);
      tl.to(ball, { opacity: 1, duration: 0.01 }, 'drop')
        .to(ball, { y: 0, duration: 0.42, ease: 'power2.in' }, 'drop')
        .to(ball, { scaleX: 1.8, scaleY: 0.45, duration: 0.08, ease: 'power1.out' })
        .to(ball, { scaleX: 0.85, scaleY: 1.25, y: -80, duration: 0.3, ease: 'power2.out' })
        .to(ball, { scaleX: 1, scaleY: 1, y: 0, duration: 0.3, ease: 'power2.in' })
        .to(ball, { scaleX: 1.4, scaleY: 0.7, duration: 0.07 })
        .to(ball, { scaleX: 1, scaleY: 1, duration: 0.35, ease: 'elastic.out(1, 0.4)' });

      // 4. ברגע הנחיתה: לבבונים קטנים מתפזרים, והלוגו רוקד "ג'לי"
      tl.addLabel('land', 'drop+=0.42');
      gsap.utils.toArray<HTMLElement>('.pre-spark').forEach((el, i) => {
        const angle = (i / SPARKS) * Math.PI * 2 - Math.PI / 2;
        const dist = 110 + (i % 2) * 40;
        tl.fromTo(el,
          { x: 0, y: 0, scale: 0, opacity: 1, rotation: 0 },
          { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 1, opacity: 0, rotation: gsap.utils.random(-60, 60), duration: 1.1, ease: 'power3.out' },
          'land');
      });
      tl.to('.pre-logo', { scaleX: 1.14, scaleY: 0.88, duration: 0.1, ease: 'power1.out' }, 'land')
        .to('.pre-logo', { scaleX: 1, scaleY: 1, duration: 1.0, ease: 'elastic.out(1.3, 0.3)' }, 'land+=0.1');

      // 5. הסלוגן נכנס מענק ונשאר גדול
      tl.fromTo('.pre-line-1',
        { scale: 4, opacity: 0, filter: 'blur(8px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' }, 1.0);
      tl.fromTo('.pre-line-2',
        { scale: 4, opacity: 0, filter: 'blur(8px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' }, 1.45);
      // הלבבון קופץ בסוף "הערך שלנו"
      tl.fromTo('.pre-heart',
        { scale: 0, opacity: 0, rotation: -45 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(3)' }, 2.3);

      // 6. אחרי הכניסה: הלבבון פועם, הכדור מקפץ בעדינות
      tl.add(() => {
        gsap.to('.pre-heart', { scale: 1.2, duration: 0.45, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.timeline({ repeat: -1, repeatDelay: 0.35 })
          .to(ball, { y: -30, scaleX: 0.9, scaleY: 1.1, duration: 0.3, ease: 'power2.out' })
          .to(ball, { y: 0, scaleX: 1, scaleY: 1, duration: 0.3, ease: 'power2.in' })
          .to(ball, { scaleX: 1.3, scaleY: 0.75, duration: 0.06 })
          .to(ball, { scaleX: 1, scaleY: 1, duration: 0.25, ease: 'elastic.out(1, 0.4)' });
      }, 3.1);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  if (hidden) return null;

  const heartPath = 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.2.3.6.3.8 0 .8-1.2 2.3-2.4 4.4-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z';

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center gap-[1.5vh] bg-brand-soft transition-opacity duration-[600ms] ease-out overflow-hidden px-4"
      style={{ opacity: fadingOut ? 0 : 1, pointerEvents: fadingOut ? 'none' : 'auto' }}
      aria-hidden="true"
    >
      {/* הלוגו + לבבונים קטנים שמתפזרים בנחיתה */}
      <div className="relative flex items-center justify-center w-[min(42vw,28vh)] aspect-square shrink-0">
        {Array.from({ length: SPARKS }).map((_, i) => (
          <svg key={i} className="pre-spark absolute w-4 h-4 opacity-0 text-[#F0894E]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={heartPath} />
          </svg>
        ))}
        <div className="pre-logo w-full h-full opacity-0">
          <Logo className="w-full h-full text-brand-dark" />
        </div>
      </div>

      {/* הסלוגן — ענק, צמוד, ונשאר גדול */}
      <div className="flex flex-col items-center text-center font-black leading-[0.82] tracking-tight text-[clamp(52px,11vw,140px)] [@media(max-height:700px)]:text-[clamp(44px,9vh,110px)]">
        <span className="pre-line-1 block opacity-0 whitespace-nowrap text-brand-dark">המוצר שלכם</span>
        <span className="pre-line-2 flex items-center gap-[0.12em] opacity-0 whitespace-nowrap text-dark-coal">
          הערך שלנו
          <svg className="pre-heart w-[0.42em] h-[0.42em] opacity-0 text-[#F0894E] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={heartPath} />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Preloader;
