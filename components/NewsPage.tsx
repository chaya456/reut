import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LazyImage from './LazyImage';
import NewsSignup from './NewsSignup';
import { useContent } from '../context/ContentContext';

/**
 * לוח הניוז (/news): מלבנים נקיים שמראים את התוצר הסופי.
 * שם הניוז מופיע רק בריחוף על התמונה (ובטלפון — בפס עדין בתחתית המלבן).
 * לחיצה על מלבן פותחת את הניוז המלא בדף משלו (/news/<id>).
 * בלי אנימציות גלילה — כדי שהגלילה בעמוד תהיה חלקה.
 */
const NewsPage: React.FC = () => {
  const { content } = useContent();
  const items = (content.news || []).filter((i) => !i.isHidden);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'ניוז ועדכונים | רעות מחמלי - ערך מוסף';
  }, []);

  return (
    <div className="min-h-screen bg-brand-soft font-sans overflow-x-hidden w-full" dir="rtl">
      <Navbar />

      <header className="pt-36 pb-10 md:pb-12 px-[5vw] text-center">
        <h1 className="text-[clamp(40px,7vw,84px)] font-black text-dark-coal leading-[1.05] tracking-tight">
          ניוז <span className="text-brand-dark">ועדכונים</span>
        </h1>
      </header>

      <main className="px-[5vw] pb-[calc(12vw+4rem)]">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={`/news/${item.id}`}
                className="group relative block overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 aspect-[4/3]"
                aria-label={item.title}
              >
                <LazyImage
                  src={item.thumb || item.cover}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${item.thumb ? 'object-center' : 'object-top'}`}
                />
                {/* שם הניוז — מופיע בריחוף על התמונה */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-coal/80 via-dark-coal/40 to-transparent pt-12 pb-4 px-5 text-right transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                  <h2 className="text-white font-extrabold text-[clamp(18px,1.6vw,24px)] leading-tight drop-shadow">
                    {item.title}
                  </h2>
                </div>
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
