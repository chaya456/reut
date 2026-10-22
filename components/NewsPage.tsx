import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './Navbar';
import Footer from './Footer';
import LazyImage from './LazyImage';
import NewsSignup from './NewsSignup';
import { useContent } from '../context/ContentContext';
import { runAfterPreloader } from '../preloaderTiming';

gsap.registerPlugin(ScrollTrigger);

const scrollToSignup = () =>
  document.getElementById('news-signup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

/**
 * לוח הניוז (/news): מלבנים נקיים שמראים את התוצר הסופי — בלי מלל ובלי תוויות.
 * לחיצה על מלבן פותחת את הניוז המלא בדף משלו (/news/<id>).
 */
const NewsPage: React.FC = () => {
  const { content } = useContent();
  const items = (content.news || []).filter((i) => !i.isHidden);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'ניוז ועדכונים | רעות מחמלי - ערך מוסף';
  }, []);

  // אנימציית כניסה — רק אחרי שמסך הטעינה נעלם (אם הוצג).
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    const cancel = runAfterPreloader(100, () => {
      ctx = gsap.context(() => {
        gsap.fromTo('.news-head', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1 });
        gsap.fromTo(
          '.news-card',
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform',
            scrollTrigger: { trigger: '.news-grid', start: 'top 92%' },
          }
        );
      }, rootRef);
    });
    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-brand-soft font-sans overflow-x-hidden w-full" dir="rtl">
      <Navbar />

      <header className="pt-36 pb-10 md:pb-12 px-[5vw] text-center">
        <h1 className="news-head text-[clamp(40px,7vw,84px)] font-black text-dark-coal leading-[1.05] tracking-tight">
          ניוז <span className="text-brand-dark">ועדכונים</span>
        </h1>
        <button
          type="button"
          onClick={scrollToSignup}
          className="news-head mt-8 inline-flex items-center gap-2 px-8 py-4 bg-dark-coal text-white font-bold text-[clamp(16px,1.6vw,20px)] shadow-lg hover:bg-brand-dark transition-colors duration-300"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          הרשמה לניוז
        </button>
      </header>

      <main className="px-[5vw] pb-24">
        <div className="max-w-[1240px] mx-auto">
          <div className="news-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={`/news/${item.id}`}
                className="news-card group relative block overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-500 aspect-[4/3]"
                aria-label={item.title}
              >
                <LazyImage
                  src={item.thumb || item.cover}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] ${item.thumb ? 'object-center' : 'object-top'}`}
                />
              </a>
            ))}
          </div>

          <div className="mt-16">
            <NewsSignup />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
