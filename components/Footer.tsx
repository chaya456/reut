
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_CONFIG } from '../formConfig';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  /** מסתיר את טופס "ככה נערכים" (הצעת מחיר) — משמש בעמוד המחשבון, שם הטופס מיותר. */
  hideContactForm?: boolean;
}

const Footer: React.FC<FooterProps> = ({ hideContactForm = false }) => {
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
    
  // Social Links
  // Gmail Compose Link construction
  const emailRecipient = "c0548496967@gmail.com";
  const emailSubject = "גם אני רוצה אתר עם תוצאות";
  const emailBody = `היי
ראיתי את האתר של רעות
אני רוצה אתר שיביא תוצאות`;
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailRecipient}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  useEffect(() => {
    const ctx = gsap.context(() => {
        const texts = gsap.utils.toArray<HTMLElement>('.animate-text-footer');
        texts.forEach((text) => {
            gsap.fromTo(text, 
                { y: 30, opacity: 0 },
                { 
                    y: 0, opacity: 1, duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: text, start: "top 95%" }
                }
            );
        });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        // Create FormData for MailerLite
        const formData = new FormData();
        formData.append('fields[name]', name);
        formData.append('fields[email]', email);
        
        // Combine Phone and Message because the MailerLite form uses 'last_name' for the text area
        // and does not have a dedicated phone field in the snippet provided.
        const fullMessage = `טלפון: ${phone || 'לא צוין'}\n\nהודעה: ${message || ''}`;
        
        // Map to 'fields[last_name]' as per the provided HTML snippet for the textarea
        formData.append('fields[last_name]', fullMessage);
        
        formData.append('ml-submit', '1');
        formData.append('anticsrf', 'true');

        // Use fetch with no-cors mode for MailerLite - Specific Contact URL
        await fetch(CONTACT_CONFIG.contactUrl, {
            method: "POST",
            mode: 'no-cors', 
            body: formData
        });

        // In no-cors mode, we can't check response.ok, so we assume success if no network error thrown
        setIsSuccess(true);
        setName(''); setPhone(''); setEmail(''); setMessage('');
        
    } catch (error) {
        console.error("Form error:", error);
        alert("אירעה שגיאה בשליחה, אנא נסי שנית או פני בווצאפ");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="relative -mt-[25vw] z-10 pb-0" ref={footerRef} id="contact">
        <div 
            className="absolute top-0 left-0 w-full h-full bg-brand-light z-0 pointer-events-none"
            style={{ clipPath: 'polygon(0 5vw, 100% 30vw, 100% 100%, 0 100%)', height: '100%' }}
        />

        <footer 
            className="bg-dark-coal text-white text-center relative z-10"
            style={{ clipPath: 'polygon(0 20vw, 100% 0, 100% 100%, 0 100%)', paddingTop: '25vw', paddingBottom: '20px' }}
        >
            <div className="max-w-[1000px] mx-auto px-[5vw]">
                {!hideContactForm && (
                <>
                {/* Title */}
                <h2 className="text-[clamp(32px,5vw,70px)] font-extrabold mb-[2vh] leading-tight animate-text-footer md:whitespace-nowrap">
                    <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">ככה</span> נערכים
                </h2>
                <div className="text-[clamp(16px,2vw,24px)] leading-[1.6] opacity-80 max-w-[700px] mx-auto mb-[2vh] animate-text-footer">
                    מתעניינים על הוספת <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">ערך</span> למוצר?<br />
                    יש לכם מוצר חדש?<br />
                    יכול להיות שכבר מיתגנו ועדיין לא ראיתם :)
                </div>
                
                <div className="mb-[4vh] animate-text-footer">
                    <a 
                        href={gmailLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[clamp(18px,2.5vw,28px)] font-bold text-[#FFB07C] hover:text-white transition-colors underline underline-offset-8 decoration-2"
                    >
                        כאן בודקים את זה
                    </a>
                </div>

                {/* Form Area */}
                <div className="max-w-[800px] mx-auto text-right mb-[4vh] animate-text-footer" id="contact-form-fields">
                    {isSuccess ? (
                        <div className="bg-white/10 p-10 text-center border border-brand-light/20 animate-[fadeIn_0.5s_ease-out]">
                             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light text-dark-coal mb-4 shadow-lg">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                             </div>
                             <h3 className="text-3xl font-bold text-brand-light mb-2">תודה רבה!</h3>
                             <p className="text-xl text-white/90">הפרטים נשלחו בהצלחה.<br/>אנחנו כבר מתחילים להערך :)</p>
                             <button onClick={() => setIsSuccess(false)} className="mt-8 text-sm text-white/50 hover:text-white underline transition-colors">שליחת הודעה נוספת</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5vh] mb-[1.5vh]">
                                {/* REQUIRED fields */}
                                <input type="text" placeholder="שם מלא *" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-[clamp(10px,1.5vh,15px)] border border-white/30 bg-white/5 rounded-none text-white text-base placeholder-white/50 focus:outline-none focus:border-brand-light focus:bg-white/10 transition-colors" />
                                
                                {/* OPTIONAL field */}
                                <input type="tel" placeholder="נייד" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-[clamp(10px,1.5vh,15px)] border border-white/30 bg-white/5 rounded-none text-white text-base placeholder-white/50 focus:outline-none focus:border-brand-light focus:bg-white/10 transition-colors text-right" />
                                
                                {/* REQUIRED field */}
                                <input type="email" placeholder="מייל *" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-[clamp(10px,1.5vh,15px)] border border-white/30 bg-white/5 rounded-none text-white text-base placeholder-white/50 focus:outline-none focus:border-brand-light focus:bg-white/10 transition-colors" />
                            </div>
                            <div className="mb-[1.5vh]">
                                {/* OPTIONAL field */}
                                <textarea placeholder="מעוניין בהצעת מחיר מותאמת אישית על..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-[clamp(10px,1.5vh,15px)] border border-white/30 bg-white/5 rounded-none text-white text-base placeholder-white/50 focus:outline-none focus:border-brand-light focus:bg-white/10 transition-colors min-h-[120px] resize-y" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full p-[clamp(10px,1.5vh,15px)] bg-brand-light text-dark-coal font-extrabold border-none rounded-none text-lg cursor-pointer hover:bg-brand-dark hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {isSubmitting ? 'שולח...' : 'מתחילים להערך'}
                            </button>
                        </form>
                    )}
                </div>
                </>
                )}

                <div className="text-center text-white/40 text-xs mt-2 mb-8 animate-text-footer">
                    גאולה, ירושלים | אופציה למשלוחים
                </div>
                
                {/* Credits */}
                <div className="border-t border-white/10 pt-4 mt-2 text-sm md:text-base text-white/60 flex flex-col md:flex-row items-center justify-center gap-4 animate-text-footer relative pb-2">
                    <a 
                        href="https://erech-musaf.co.il/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-semibold text-white/80 hover:text-brand-light transition-colors"
                    >
                        אתרים שעובדים ח. גוטפרב
                    </a>
                    <span className="hidden md:inline text-white/30">|</span>
                    <a href={gmailLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light transition-colors font-bold focus:outline-none">צור קשר</a>
                </div>

                {/* Beta Warning */}
                {!isSuccess && (
                    <p className="text-center text-white/20 text-xs mt-0 mb-4">האתר בהרצה, יתכנו חסרים וליקויים, מצאת משו? ספרי לנו</p>
                )}

                {/* SEO Products Link */}
                {/* Legal Links */}
                <div className="flex items-center justify-center gap-3 text-[11px] md:text-xs text-white/40 mt-4 animate-text-footer flex-wrap">
                    <a href="/accessibility" className="hover:text-brand-light transition-colors">הצהרת נגישות</a>
                    <span>|</span>
                    <a href="/privacy" className="hover:text-brand-light transition-colors">מדיניות פרטיות</a>
                    <span>|</span>
                    <a href="/terms" className="hover:text-brand-light transition-colors">תקנון אתר</a>
                </div>
            </div>
        </footer>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
    </div>
  );
};

export default Footer;
