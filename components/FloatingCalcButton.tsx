import React from 'react';

/**
 * כפתור צף קבוע שמופיע בפינה בכל האתר ומוביל למחשבון התמחור.
 * מוצג בצד ימין למטה (הצד השני מרכיב הנגישות שנמצא משמאל למטה).
 */
const FloatingCalcButton: React.FC = () => {
  return (
    <a
      href="/calculator"
      aria-label="מחשבון מחירים"
      className="fixed bottom-5 right-5 z-[150] flex items-center gap-2 bg-brand-dark text-white pl-5 pr-4 py-3 rounded-full font-bold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-dark-coal hover:scale-105 transition-all duration-300"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"></rect>
        <line x1="8" y1="6" x2="16" y2="6"></line>
        <line x1="8" y1="10" x2="10" y2="10"></line>
        <line x1="12" y1="10" x2="14" y2="10"></line>
        <line x1="8" y1="14" x2="10" y2="14"></line>
        <line x1="12" y1="14" x2="14" y2="14"></line>
        <line x1="8" y1="18" x2="10" y2="18"></line>
        <line x1="12" y1="18" x2="14" y2="18"></line>
      </svg>
      <span className="hidden sm:inline">מחשבון מחירים</span>
    </a>
  );
};

export default FloatingCalcButton;
