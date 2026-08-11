import React, { useState, useEffect } from 'react';
import { useContent, defaultNewsPopup } from '../context/ContentContext';
import { CONTACT_CONFIG } from '../formConfig';

// חלונית "ניוז" קופצת בכניסה לאתר. התוכן (תמונה, כותרת, טקסט, כפתור) נשלט לגמרי
// מלוח הבקרה של רעות (טאב "חלונית קופצת") ונשמר ל-Sanity.
// המבקר משאיר שם ומייל, והפרטים נשלחים ל-MailerLite (אותו טופס של הניוזלטר).
const NewsPopupModal: React.FC = () => {
  const { content } = useContent();
  const popup = { ...defaultNewsPopup, ...(content.newsPopup || {}) };

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // מציגים רק אם החלונית מופעלת מהניהול. פעם אחת לכל ביקור (סשן).
    if (!popup.enabled) return;

    const timer = setTimeout(() => {
      const hasSeen = sessionStorage.getItem('hasSeenNewsPopup');
      if (!hasSeen) setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [popup.enabled]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenNewsPopup', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fields[name]', name);
      formData.append('fields[email]', email);
      formData.append('ml-submit', '1');

      await fetch(CONTACT_CONFIG.newsletterUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      // no-cors => תשובה אטומה, מניחים הצלחה
      setSubmitted(true);
      sessionStorage.setItem('hasSeenNewsPopup', 'true');
      setTimeout(() => setIsOpen(false), 2200);
    } catch (error) {
      console.error(error);
      alert('אירעה תקלה, אנא נסו שוב מאוחר יותר');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-dark-coal/30 backdrop-blur-sm transition-opacity duration-500" onClick={handleClose}></div>

      <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.15)] max-w-[min(760px,92vw)] w-full flex flex-col md:flex-row overflow-hidden animate-[newsPopIn_0.7s_cubic-bezier(0.16,1,0.3,1)] ring-1 ring-white/50">

        <button onClick={handleClose} className="absolute top-4 right-4 z-20 text-dark-coal/60 hover:text-dark-coal transition-colors duration-300 text-xl bg-white/40 hover:bg-white/60 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md" aria-label="סגירה">✕</button>

        {/* תמונה */}
        {popup.image && (
          <div className="w-full md:w-[45%] h-[22vh] md:h-auto relative shrink-0">
            <img src={popup.image} alt={popup.title || 'ניוז'} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent mix-blend-overlay"></div>
          </div>
        )}

        {/* תוכן */}
        <div className={`w-full ${popup.image ? 'md:w-[55%]' : ''} p-[6%] md:p-8 text-center flex flex-col justify-center items-center relative`}>
          {submitted ? (
            <div className="py-8 flex flex-col items-center gap-3" dir="rtl">
              <div className="w-14 h-14 rounded-full bg-brand-dark/90 text-white flex items-center justify-center text-3xl">✓</div>
              <h2 className="text-[clamp(20px,2.4vw,28px)] font-extrabold text-dark-coal">תודה רבה!</h2>
              <p className="text-[clamp(14px,1.1vw,16px)] text-dark-coal/70 font-medium">קיבלנו את הפרטים ונחזור אליכם בהקדם.</p>
            </div>
          ) : (
            <>
              {popup.title && (
                <h2 className="text-[clamp(24px,3vw,34px)] font-extrabold text-dark-coal mb-3 leading-tight tracking-tight drop-shadow-sm" dir="rtl">
                  {popup.title}
                </h2>
              )}

              {popup.text && (
                <p className="text-[clamp(15px,1.2vw,18px)] text-dark-coal/80 mb-5 max-w-[420px] leading-relaxed font-medium whitespace-pre-line" dir="rtl">
                  {popup.text}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-[340px]" dir="rtl">
                {/* Honeypot נגד ספאם */}
                <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <input
                  type="text"
                  placeholder="שם"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-white/50 border-b border-dark-coal/20 focus:outline-none focus:bg-white/70 focus:border-brand-dark transition-all placeholder-dark-coal/50 text-dark-coal text-right rounded-t-sm text-sm"
                />
                <input
                  type="email"
                  placeholder="כתובת מייל"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-white/50 border-b border-dark-coal/20 focus:outline-none focus:bg-white/70 focus:border-brand-dark transition-all placeholder-dark-coal/50 text-dark-coal text-right rounded-t-sm text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-3 mt-1 bg-brand-dark/90 hover:bg-brand-dark text-white font-bold text-lg tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 backdrop-blur-sm disabled:opacity-70"
                >
                  {isSubmitting ? 'שולח...' : (popup.buttonText || 'שליחה')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes newsPopIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

export default NewsPopupModal;
