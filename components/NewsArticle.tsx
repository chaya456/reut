import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import NewsSignup from './NewsSignup';
import { useContent } from '../context/ContentContext';

/**
 * דף ניוז מלא (/news/<id>): הגרפיקה של הניוז מוטמעת בגדול בתוך האתר,
 * וכל התמונות של אותו ניוז מוצגות ברצף אחד ארוך (בלי מעבר תמונה-תמונה).
 */
const NewsArticle: React.FC<{ id: number }> = ({ id }) => {
  const { content } = useContent();
  const items = (content.news || []).filter((i) => !i.isHidden);
  const item = items.find((i) => i.id === id);
  const images = item ? [item.cover, ...(item.images || [])].filter(Boolean) : [];

  // ניווט לניוז הבא/הקודם ברשימה
  const index = item ? items.indexOf(item) : -1;
  const prevItem = index > 0 ? items[index - 1] : null;
  const nextItem = index >= 0 && index < items.length - 1 ? items[index + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = item ? `${item.title} | ניוז | רעות מחמלי - ערך מוסף` : 'ניוז | רעות מחמלי - ערך מוסף';
  }, [item]);

  return (
    <div className="min-h-screen bg-brand-soft font-sans overflow-x-hidden w-full" dir="rtl">
      <Navbar />

      <main className="pt-[clamp(150px,18vh,210px)] pb-[calc(12vw+4rem)] px-[5vw]">
        <div className="max-w-[760px] mx-auto">
          <a href="/news" className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-brand-light text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-colors mb-6 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            לכל הניוזים
          </a>

          {!item ? (
            <p className="text-center text-xl text-dark-coal/70 py-20">הניוז הזה לא נמצא.</p>
          ) : (
            <>
              <h1 className="text-[clamp(30px,4.5vw,52px)] font-black text-dark-coal leading-tight mb-8">{item.title}</h1>

              {/* הניוז המלא — רצף אחד ארוך */}
              <article className="bg-white shadow-xl overflow-hidden">
                {images.map((src, i) => (
                  <img key={i} src={src} alt={i === 0 ? item.title : `${item.title} ${i + 1}`} className="block w-full h-auto" />
                ))}
              </article>

              {(prevItem || nextItem) && (
                <nav className="flex justify-between gap-4 mt-8 font-bold" aria-label="ניווט בין ניוזים">
                  {prevItem ? (
                    <a href={`/news/${prevItem.id}`} className="text-dark-coal hover:text-brand-dark transition-colors">→ {prevItem.title}</a>
                  ) : <span />}
                  {nextItem ? (
                    <a href={`/news/${nextItem.id}`} className="text-dark-coal hover:text-brand-dark transition-colors">{nextItem.title} ←</a>
                  ) : <span />}
                </nav>
              )}
            </>
          )}

          {/* חזרה ללוח הניוזים גם בסוף הניוז (אחרי גלילה בתמונה הארוכה) */}
          <div className="mt-10 flex justify-center">
            <a href="/news" className="inline-flex items-center gap-2 px-8 py-4 bg-dark-coal text-white font-bold text-[clamp(16px,1.5vw,19px)] hover:bg-brand-dark transition-colors shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              לכל הניוזים
            </a>
          </div>

          <div className="mt-14">
            <NewsSignup />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsArticle;
