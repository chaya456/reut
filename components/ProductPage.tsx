import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { products } from '../data/products';

interface ProductPageProps {
  slug: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ slug }) => {
  const product = products.find(p => p.id === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      document.title = `${product.seoTitle} | רעות מחמלי - ערך מוסף`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-soft font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-[20vh] pb-[10vh] text-center px-[5vw]">
          <h1 className="text-5xl font-bold text-dark-coal mb-6">המוצר לא נמצא</h1>
          <p className="text-xl text-dark-coal/70 mb-8">
            מצטערים, לא מצאנו את המוצר שחיפשת.
          </p>
          <a 
            href="/products" 
            className="inline-block px-8 py-4 bg-brand-dark text-white font-bold text-lg hover:bg-dark-coal transition-colors shadow-lg"
          >
            לכל המוצרים שלנו
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-soft font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[20vh] pb-[60vw] md:pb-[40vw] lg:pb-[35vw] px-[5vw] max-w-[1000px] mx-auto w-full relative z-20">
        <div className="mb-6">
          <a href="/" className="text-brand-dark hover:text-dark-coal font-medium flex items-center gap-2 transition-colors w-fit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            חזרה לעמוד הראשי
          </a>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-brand-light/20">
          <h1 className="text-[clamp(32px,4vw,50px)] font-extrabold text-dark-coal mb-6 leading-tight">
            {product.seoTitle}
          </h1>
          
          <div className="text-lg md:text-xl text-dark-coal/80 leading-relaxed space-y-6">
            <p className="text-2xl font-medium text-brand-dark mb-4">
              {product.description}
            </p>
            <p>
              מחפשים להוסיף ערך מוסף ל{product.baseName}? אצלנו ברעות מחמלי מתמחים במיתוג אישי, חריטות לייזר מדויקות והטבעות בחום על מגוון רחב של מוצרים, כולל {product.baseName}.
            </p>
            <p>
              בין אם מדובר במתנה אישית ומרגשת, מוצר קד"מ לעסק, או מזכרת לאירוע מיוחד - אנחנו כאן כדי להפוך כל {product.baseName} לייחודי ובלתי נשכח. אנו משתמשים במכשור החדשני ביותר כדי להבטיח תוצאה מושלמת, אסתטית ועמידה לאורך זמן.
            </p>
            <p>
              התהליך שלנו כולל ייעוץ אישי, בחירת העיצוב המתאים ביותר ל{product.baseName}, וביצוע קפדני עד לקבלת התוצאה המושלמת.
            </p>
            
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-2xl font-bold text-dark-coal mb-4">למה לבחור בנו?</h3>
              <ul className="list-disc list-inside space-y-2 text-dark-coal/70">
                <li>דיוק מקסימלי ואיכות גימור ללא פשרות</li>
                <li>שירות אישי והתאמה מדויקת לצרכים שלכם</li>
                <li>שימוש בטכנולוגיות חריטה והטבעה מתקדמות</li>
                <li>ניסיון עשיר במיתוג מגוון רחב של חומרים ומוצרים</li>
              </ul>
            </div>
            
            <div className="mt-10 text-center">
              <a 
                href="/#contact" 
                className="inline-block px-8 py-4 bg-brand-dark text-white font-bold text-lg hover:bg-dark-coal transition-colors shadow-lg"
              >
                לקבלת הצעת מחיר למיתוג {product.baseName}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
