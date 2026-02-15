
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AdminPanel from './AdminPanel';
import { CONTACT_CONFIG } from '../formConfig';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [showContact, setShowContact] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Admin State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
    
  // Social Links
  const whatsappLink = "https://wa.me/972539660418";

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

  const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword === 'רעות') {
          setIsAdminOpen(true);
          setShowAdminLogin(false);
          setAdminPassword('');
      } else {
          alert('סיסמה שגויה');
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
                {/* Title */}
                <h2 className="text-[clamp(32px,5vw,70px)] font-extrabold mb-[2vh] leading-tight animate-text-footer md:whitespace-nowrap">
                    <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">מעריכה</span> שהגעת עד לכאן
                </h2>
                <div className="text-[clamp(16px,2vw,24px)] leading-[1.6] opacity-80 max-w-[700px] mx-auto mb-[2vh] animate-text-footer">
                    יש לך מוצר חדש?<br />
                    מתעניינים על הוספת <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">ערך</span> למוצר?<br />
                    יכול להיות שכבר מיתגנו אותו ועדיין לא ראית :)
                </div>
                
                {/* Spacer to replace the removed link */}
                <div className="h-[3vh] animate-text-footer"></div>

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
                                <textarea placeholder="גמני רוצה להוסיף ערך למוצר ורוצה לדעת פרטים על:" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-[clamp(10px,1.5vh,15px)] border border-white/30 bg-white/5 rounded-none text-white text-base placeholder-white/50 focus:outline-none focus:border-brand-light focus:bg-white/10 transition-colors min-h-[120px] resize-y" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full p-[clamp(10px,1.5vh,15px)] bg-brand-light text-dark-coal font-extrabold border-none rounded-none text-lg cursor-pointer hover:bg-brand-dark hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                {isSubmitting ? 'שולח...' : 'מתחילה להערך'}
                            </button>
                        </form>
                    )}
                </div>
                
                {/* Credits */}
                <div className="border-t border-white/10 pt-4 mt-2 text-sm md:text-base text-white/60 flex flex-col md:flex-row items-center justify-center gap-4 animate-text-footer relative pb-2">
                    <span className="font-semibold text-white/80">אתרים שעובדים ח. גוטפרב</span>
                    <span className="hidden md:inline text-white/30">|</span>
                    <div className="relative">
                        <button onClick={() => setShowContact(!showContact)} className="hover:text-brand-light transition-colors font-bold flex items-center gap-2 focus:outline-none">צור קשר</button>
                        {showContact && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white text-dark-coal p-4 rounded-none shadow-xl min-w-[200px] flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out] z-50 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[8px] after:border-transparent after:border-t-white">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors p-2 hover:bg-gray-50"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.029.662 1.977 1.216 3.073 1.216.001 0 .002 0 .002 0 3.181 0 5.768-2.587 5.768-5.766 0-3.18-2.587-5.627-5.768-5.766zm9.969 5.766c0 5.504-4.478 9.981-9.981 9.981-5.281 0-9.626-4.061-9.948-9.172l-2.071 7.253 7.643-2.007c1.32.72 2.825 1.129 4.376 1.129 5.503 0 9.981-4.477 9.981-9.981 0-5.504-4.478-9.982-9.981-9.982-5.503 0-9.981 4.478-9.981 9.982 0 1.246.231 2.435.644 3.535l-1.603-5.908c-.287-1.043.292-2.128 1.296-2.427 1.004-.298 2.062.274 2.36 1.373l1.985 7.31c.298 1.099-.275 2.217-1.279 2.516-.145.043-.292.064-.437.064-.863 0-1.637-.58-1.879-1.47l-.903-3.329c-.066-.242.079-.494.321-.56.242-.066.495.079.56.321l.666 2.455c.066.242.318.387.56.321.242-.066.387-.318.321-.56l-1.984-7.311c-.066-.241-.318-.386-.56-.32-.242.066-.387.318-.32.56l1.378 5.078c-3.036-1.619-5.111-4.787-5.111-8.472 0-5.32 4.328-9.648 9.648-9.648 5.32 0 9.648 4.328 9.648 9.648z"/></svg><span className="font-medium">וואטסאפ</span></a>
                            </div>
                        )}
                    </div>
                </div>

                {/* HIDDEN ADMIN LOGIN */}
                <div className="flex flex-col items-center justify-center mt-2 pb-4">
                     <button 
                        onClick={() => setShowAdminLogin(!showAdminLogin)} 
                        className="text-[10px] text-white/10 hover:text-white/30 transition-colors"
                     >
                         ניהול אתר
                     </button>
                     
                     {showAdminLogin && (
                         <form onSubmit={handleAdminLogin} className="mt-2 flex gap-2 animate-[fadeIn_0.2s_ease-out]">
                             <input 
                                type="password" 
                                placeholder="סיסמה" 
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="px-2 py-1 text-xs text-dark-coal rounded"
                             />
                             <button type="submit" className="px-2 py-1 bg-brand-light text-dark-coal text-xs font-bold rounded">כניסה</button>
                         </form>
                     )}
                </div>

                {/* Beta Warning */}
                {!isSuccess && (
                    <p className="text-center text-white/20 text-xs mt-0 mb-4">האתר בהרצה, יתכנו חסרים וליקויים, מצאת משו? ספרי לנו</p>
                )}
            </div>

            {/* Render Admin Panel if authenticated */}
            <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
        </footer>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
    </div>
  );
};

export default Footer;