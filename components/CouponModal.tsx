
import React, { useState, useEffect } from 'react';

const CouponModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Show coupon after 2 seconds
    const timer = setTimeout(() => { 
        // We'll keep it showing every refresh for now so the user can see the design
        setIsOpen(true); 
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRedeem = () => {
    setIsOpen(false);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-brand-light/30 backdrop-blur-md transition-opacity duration-500" onClick={handleClose}></div>

      <div className="relative bg-[#fffcf9]/60 backdrop-blur-2xl max-w-sm w-full shadow-[0_40px_120px_rgba(183,110,79,0.2)] animate-[premiumEntry_0.8s_cubic-bezier(0.16,1,0.3,1)] border border-brand-dark/10 overflow-hidden">
        
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-brand-dark/30 m-3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-brand-dark/30 m-3 pointer-events-none"></div>

        <button 
            onClick={handleClose} 
            className="absolute top-3 right-3 z-20 text-dark-coal/40 hover:text-brand-dark transition-all duration-300 transform hover:rotate-90" 
            aria-label="Close"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div className="p-8 text-center relative z-10">
            <div className="mb-6 inline-flex flex-col items-center">
                <div className="w-8 h-[1px] bg-dark-coal mb-1"></div>
                <span className="text-dark-coal uppercase tracking-[0.2em] text-[10px] font-bold">הטבה בלעדית</span>
                <div className="w-8 h-[1px] bg-dark-coal mt-1"></div>
            </div>
            
            <h2 className="text-4xl font-black text-brand-dark mb-1 tracking-tighter">
                30% <span className="text-2xl font-light">הנחה</span>
            </h2>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-dark/20 to-transparent my-4"></div>
            
            <p className="text-base text-dark-coal/80 mb-6 leading-relaxed font-medium">
                להזמנות עד 400 ש"ח
                <br />
                <span className="block mt-3 text-xl font-bold text-dark-coal tracking-normal">קוד קופון מרכנתיל 30</span>
            </p>
            
            <div className="flex flex-col gap-3">
                <button 
                    onClick={handleRedeem}
                    className="w-full bg-brand-dark text-white py-3 px-6 font-bold text-xs tracking-[0.1em] hover:bg-dark-coal transition-all duration-500 shadow-lg shadow-brand-dark/20"
                >
                    מימוש ההטבה
                </button>
                <div className="text-[9px] text-dark-coal/40 uppercase tracking-widest">
                    בתוקף עד ה-30.05.2026
                </div>
            </div>
        </div>

        {/* Bottom pattern */}
        <div className="h-2 bg-brand-dark w-full relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff4_1px,transparent_0)] bg-[size:4px_4px]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes premiumEntry { 
            0% { opacity: 0; transform: translateY(40px) scale(0.98); } 
            100% { opacity: 1; transform: translateY(0) scale(1); } 
        }
      `}</style>
    </div>
  );
};

export default CouponModal;
