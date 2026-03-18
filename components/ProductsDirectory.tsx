import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { products } from '../data/products';

const ProductsDirectory: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "המוצרים שלנו | רעות מחמלי - ערך מוסף";
  }, []);

  return (
    <div className="min-h-screen bg-brand-soft font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-[20vh] pb-[60vw] md:pb-[40vw] lg:pb-[35vw] px-[5vw] max-w-[1200px] mx-auto w-full relative z-20">
        <div className="mb-6">
          <a href="/" className="text-brand-dark hover:text-dark-coal font-medium flex items-center gap-2 transition-colors w-fit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            חזרה לעמוד הראשי
          </a>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-[clamp(36px,5vw,60px)] font-extrabold text-dark-coal mb-4">
            המוצרים שלנו
          </h1>
          <p className="text-xl text-dark-coal/70 max-w-[800px] mx-auto">
            אנו מתמחים בחריטה, מיתוג והטבעה על מגוון רחב של מוצרים. בחרו מוצר מהרשימה כדי לגלות איך נוכל להוסיף לו ערך מוסף.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <a 
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white p-6 text-center rounded-xl shadow-sm hover:shadow-md border border-brand-light/20 hover:border-brand-dark transition-all duration-300 group"
            >
              <h3 className="text-lg font-bold text-dark-coal group-hover:text-brand-dark transition-colors">
                {product.seoTitle}
              </h3>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsDirectory;
