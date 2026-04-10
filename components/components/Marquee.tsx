import React from 'react';
import { products } from '../data/products';

const Marquee: React.FC = () => {
  return (
    <div 
      className="relative w-[110vw] -ml-[5vw] overflow-hidden bg-brand-dark text-white py-4 z-40 shadow-2xl border-y-2 border-white/20" 
      dir="ltr"
      style={{ 
        transform: 'skewY(-8.53deg)', // Matches the 15vw/100vw slope of the About section exactly
        marginTop: '7.5vw', // Shifts down to align perfectly with the bottom-left corner
        marginBottom: '7.5vw'
      }}
    >
      <div className="flex w-max animate-scroll-right">
        {/* First set of items */}
        <div className="flex items-center whitespace-nowrap">
          {products.map((p, i) => (
            <React.Fragment key={`set1-${i}`}>
              <span className="text-lg md:text-2xl font-light tracking-widest px-2">
                {p.baseName}
              </span>
              <span className="text-lg md:text-2xl font-light tracking-widest px-2">|</span>
            </React.Fragment>
          ))}
        </div>
        {/* Second set of items for seamless loop */}
        <div className="flex items-center whitespace-nowrap">
          {products.map((p, i) => (
            <React.Fragment key={`set2-${i}`}>
              <span className="text-lg md:text-2xl font-light tracking-widest px-2">
                {p.baseName}
              </span>
              <span className="text-lg md:text-2xl font-light tracking-widest px-2">|</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
