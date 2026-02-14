import React, { useState, useEffect } from 'react';

const NewsletterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    // Show modal after 7 seconds
    const timer = setTimeout(() => { setIsOpen(true); }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('fields[name]', name);
    formData.append('fields[email]', email);
    formData.append('ml-submit', '1');
    formData.append('ajax', '1');

    try {
        // MailerLite Endpoint for form ID 179288490336323106
        await fetch('https://assets.mailerlite.com/jsonp/2099621/forms/179288490336323106/subscribe', {
            method: 'POST', 
            body: formData, 
            mode: 'no-cors' 
        });
        setIsSuccess(true);
    } catch (error) {
        console.error('Submission error:', error);
        alert("אירעה שגיאה בשליחה, אנא נסי שנית.");
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-dark-coal/20 backdrop-blur-sm transition-opacity duration-500" onClick={() => setIsOpen(false)}></div>

      <div className="relative bg-white/50 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] max-w-[min(800px,90vw)] w-full flex flex-col md:flex-row overflow-hidden animate-[popIn_0.8s_cubic-bezier(0.16,1,0.3,1)] ring-1 ring-white/50">
        
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 text-dark-coal/60 hover:text-dark-coal transition-colors duration-300 text-xl bg-white/40 hover:bg-white/60 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md" aria-label="Close">✕</button>

        <div className="w-full md:w-[45%] h-[20vh] md:h-auto relative">
             <img src="https://i.postimg.cc/Jz0y86zL/tmwnt-hlwn-qwpz.jpg" alt="הצצה לקולקציה" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
             <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent mix-blend-overlay"></div>
        </div>

        <div className="w-full md:w-[55%] p-[5%] text-center flex flex-col justify-center items-center relative">
            <h2 className="text-[clamp(24px,3vw,32px)] font-extrabold text-dark-coal mb-2 leading-tight tracking-tight drop-shadow-sm">
            יש לנו <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">ערך</span> מוסף
            </h2>
            
            {isSuccess ? (
                <div className="py-10 animate-[fadeIn_0.5s]">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-dark-coal mb-4 shadow-lg">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 className="text-2xl font-bold text-dark-coal mb-2">איזה כיף שהצטרפת!</h3>
                    <p className="text-dark-coal/70">ההטבה בדרך למייל שלך :)</p>
                    <button onClick={() => setIsOpen(false)} className="mt-6 text-sm underline text-brand-dark">סגירה</button>
                </div>
            ) : (
                <>
                    {/* Launch Week Promotion Details */}
                    <div className="w-full max-w-[320px] mb-[3vh] space-y-1">
                        <p className="text-brand-dark font-bold text-lg">הטבה מיוחדת לשבוע ההשקה</p>
                        <p className="text-dark-coal/70 text-sm font-medium tracking-wide">כח’ שבט - ב’ אדר תשפ"ו</p>
                        <p className="text-dark-coal font-extrabold text-[clamp(16px,1.2vw,18px)] mt-2 leading-snug">
                            בהזמנת חריטה על מוצר -<br/>מוצר שני בחמישים אחוז!
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5vh] w-full max-w-[320px]">
                        <input type="text" placeholder="שם" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 bg-white/40 border-b border-dark-coal/20 focus:outline-none focus:bg-white/60 focus:border-brand-dark transition-all placeholder-dark-coal/50 text-dark-coal text-right rounded-t-sm text-sm" />
                        <input type="email" placeholder="כתובת מייל" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2.5 bg-white/40 border-b border-dark-coal/20 focus:outline-none focus:bg-white/60 focus:border-brand-dark transition-all placeholder-dark-coal/50 text-dark-coal text-right rounded-t-sm text-sm" />
                        <button type="submit" disabled={isSubmitting} className="w-full p-2.5 mt-[1vh] bg-brand-dark/90 hover:bg-brand-dark text-white font-bold text-lg tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 backdrop-blur-sm disabled:opacity-70">
                            {isSubmitting ? 'שולח...' : 'ברור שאני בפנים :)'}
                        </button>
                    </form>
                    
                    <div className="mt-3 text-center">
                        <p className="text-sm font-bold text-gray-400">על הזול מבינהם</p>
                        <p className="text-[10px] text-dark-coal/50 mt-1">השארת הפרטים מהווה אישור לקבלת דיוור ותוכן שיווקי</p>
                    </div>
                </>
            )}
        </div>
      </div>
      <style>{`@keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
};

export default NewsletterModal;