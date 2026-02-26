import React from 'react';

const items = [
  "כפות עץ", "פלאפון", "מצלמה", "נגן", "אזניות", "פקק שעם", "כוס מאג מתכת", "צנצנות תבלינים", "קופסאות צעצועים", "תעודת לידה על שמיכי", "כפכפים", "מעמד לפלאפון", "ראש מטען", "פותחן בקבוק", "סכין לעוגה", "אטבים", "עפרונות", "שעונים", "מחזיק ספרים למדף", "חגורת עור", "תיק איפור", "סרט לשיער", "מחברת", "סרגל", "מחשבון", "מספריים לחלאקה", "מחק", "מחשב נייד", "כונן חיצוני", "דיסק אונקי", "קוביות משחק", "גיטרה", "קופסא לאזניות", "אבנים", "כיסוי עיינים", "חיתוך קופסא"
];

const text = items.join(" | ");

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
        <span className="text-lg md:text-2xl font-light tracking-widest mx-8 whitespace-nowrap">{text} | </span>
        <span className="text-lg md:text-2xl font-light tracking-widest mx-8 whitespace-nowrap">{text} | </span>
      </div>
    </div>
  );
};

export default Marquee;
