
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContentProvider, useContent } from './context/ContentContext';
import SectionRenderer from './components/SectionRenderer';
// לוח הבקרה נטען רק כשרעות פותחת אותו — כך גולשים רגילים מורידים פחות קוד והאתר עולה מהר יותר
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
import AdminToolbar from './components/editable/AdminToolbar';
import ProductsDirectory from './components/ProductsDirectory';
import PriceCalculator from './components/PriceCalculator';
import NewsPage from './components/NewsPage';
import NewsArticle from './components/NewsArticle';
import FloatingCalcButton from './components/FloatingCalcButton';
import NewsletterModal from './components/NewsletterModal';
import NewsPopupModal from './components/NewsPopupModal';
import Preloader from './components/Preloader';
import AccessibilityWidget from './components/AccessibilityWidget';
import { products } from './data/products';

gsap.registerPlugin(ScrollTrigger);

const MainContent = ({ productSlug }: { productSlug?: string }) => {
    const { 
        content, isAdmin, setIsEditMode, 
        showAdminPanel, setShowAdminPanel, login 
    } = useContent();
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);
    const [passwordInput, setPasswordInput] = React.useState('');
    const [loginError, setLoginError] = React.useState(false);

    const product = productSlug ? products.find(p => p.id === productSlug) : null;

    useEffect(() => {
        if (product) {
            document.title = `${product.seoTitle} | רעות מחמלי - ערך מוסף`;
        } else {
            document.title = `רעות מחמלי - ערך מוסף`;
        }
    }, [product]);

    // פתיחת כניסת הניהול: ?admin בכתובת, או Ctrl+Shift+A
    useEffect(() => {
        const openAdmin = () => {
            if (isAdmin) setShowAdminPanel(true);
            else setShowPasswordModal(true);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.code === 'KeyA')) {
                e.preventDefault();
                openAdmin();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isAdmin]);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).has('admin')) setShowPasswordModal(true);
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(passwordInput);
        if (success) {
            const action = (window as any)._afterLoginAction;
            if (action === 'edit') {
                setIsEditMode(true);
            } else {
                setShowAdminPanel(true);
            }
            setShowPasswordModal(false);
            setPasswordInput('');
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    // Separate Hero sections because they are fixed/background elements
    const heroSections = content.sections.filter(s => s.type === 'hero');
    const contentSections = content.sections.filter(s => s.type !== 'hero');

    return (
        <div className="min-h-screen bg-brand-soft font-sans overflow-x-hidden w-full max-w-[100vw]">
            <Navbar />
            
            {/* Hero Sections (Fixed Background) */}
            {heroSections.map(section => (
                <SectionRenderer key={section.id} section={section} isAdmin={isAdmin} />
            ))}

            {/* Main Scrollable Content */}
            <main className="relative z-20 mt-[100vh] bg-brand-soft shadow-[0_-50px_100px_rgba(0,0,0,0.1)] overflow-x-hidden">
                {contentSections.map(section => (
                    <SectionRenderer key={section.id} section={section} isAdmin={isAdmin} />
                ))}
                
                {/* SEO Product Block - Visually integrated at the bottom for Googlebot */}
                {product && (
                    <section className="py-16 px-[5vw] bg-white border-t border-brand-light/20 relative z-30">
                        <div className="max-w-[800px] mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-dark-coal mb-4">{product.seoTitle}</h2>
                            <p className="text-xl font-medium text-brand-dark mb-6">{product.description}</p>
                            <div className="text-lg text-dark-coal/80 space-y-4">
                                <p>מחפשים להוסיף ערך מוסף ל{product.baseName}? אצלנו ברעות מחמלי מתמחים במיתוג אישי, חריטות לייזר מדויקות והטבעות בחום על מגוון רחב של מוצרים, כולל {product.baseName}.</p>
                                <p>בין אם מדובר במתנה אישית ומרגשת, מוצר קד"מ לעסק, או מזכרת לאירוע מיוחד - אנחנו כאן כדי להפוך כל {product.baseName} לייחודי ובלתי נשכח. אנו משתמשים במכשור החדשני ביותר כדי להבטיח תוצאה מושלמת, אסתטית ועמידה לאורך זמן.</p>
                            </div>
                        </div>
                    </section>
                )}

                <Footer />
            </main>

            {/* כניסת ניהול: הכפתור הנסתר בפינה הוסר (גולשים לחצו עליו בטעות והוא הפריע לכפתור הנגישות).
                נכנסים עכשיו דרך הכתובת erech-musaf.co.il/?admin — או בקיצור המקלדת Ctrl+Shift+A. */}

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-dark-coal/40 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
                    <div className="bg-white p-12 rounded-none shadow-2xl w-full max-w-md relative animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)] border border-brand-light/20">
                        <button 
                            onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setLoginError(false); }}
                            className="absolute top-6 left-6 text-dark-coal/40 hover:text-dark-coal transition-colors duration-300"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                        <div className="text-center mb-10">
                            <h3 className="text-4xl font-extrabold text-dark-coal mb-2 tracking-tight">כניסת מנהלת</h3>
                            <div className="w-12 h-1 bg-brand-dark mx-auto"></div>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div className="relative group">
                                <input 
                                    type="password" 
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="סיסמה"
                                    className="w-full p-4 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-brand-dark text-right transition-all duration-300 placeholder-gray-400"
                                    autoFocus
                                />
                                <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-brand-dark transition-all duration-500 group-focus-within:w-full"></div>
                            </div>
                            
                            {loginError && (
                                <p className="text-red-500 text-sm text-center animate-pulse font-bold">
                                    סיסמה שגויה, נסי שוב
                                </p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    type="submit"
                                    onClick={() => {
                                        // We'll set a flag to open edit mode after login
                                        (window as any)._afterLoginAction = 'edit';
                                    }}
                                    className="bg-brand-dark text-white py-4 font-bold text-sm tracking-widest hover:bg-black transition-all duration-500 shadow-xl"
                                >
                                    מצב עריכה
                                </button>
                                <button 
                                    type="submit"
                                    onClick={() => {
                                        (window as any)._afterLoginAction = 'panel';
                                    }}
                                    className="bg-dark-coal text-white py-4 font-bold text-sm tracking-widest hover:bg-brand-dark transition-all duration-500 shadow-xl"
                                >
                                    לוח בקרה
                                </button>
                            </div>
                        </form>
                        
                        <p className="text-[10px] text-center text-gray-400 mt-8 uppercase tracking-widest">
                            Add Value © 2026 | Secure Access
                        </p>
                    </div>
                </div>
            )}

            {/* Global Admin Panel */}
            {showAdminPanel && isAdmin && (
                <React.Suspense fallback={null}>
                    <AdminPanel isOpen onClose={() => setShowAdminPanel(false)} />
                </React.Suspense>
            )}
            
            {/* Floating Admin Toolbar */}
            <AdminToolbar />

            {/* News Popup (admin-editable, entry popup) */}
            <NewsPopupModal />

            {/* Newsletter Modal */}
            <NewsletterModal />

            {/* Floating button to the price calculator (shown across the main site) */}
            <FloatingCalcButton />
        </div>
    );
};

import { AccessibilityStatement, PrivacyPolicy, TermsOfUse } from './components/LegalPage';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Refresh ScrollTrigger when app mounts/updates
    ScrollTrigger.refresh();
    
    // Handle popstate for back/forward navigation
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderRoute = () => {
    if (currentPath === '/products') {
      return <ProductsDirectory />;
    }

    if (currentPath === '/calculator') {
      return <PriceCalculator />;
    }

    // דף ניוז מלא: /news/<מספר>
    const newsMatch = currentPath.match(/^\/news\/(\d+)\/?$/);
    if (newsMatch) {
      return <NewsArticle id={Number(newsMatch[1])} />;
    }

    if (currentPath === '/news') {
      return <NewsPage />;
    }
    
    if (currentPath.startsWith('/product/')) {
      const encodedSlug = currentPath.split('/product/')[1];
      const slug = decodeURIComponent(encodedSlug);
      return <MainContent productSlug={slug} />;
    }

    if (currentPath === '/accessibility') {
      return <AccessibilityStatement />;
    }

    if (currentPath === '/privacy') {
      return <PrivacyPolicy />;
    }

    if (currentPath === '/terms') {
      return <TermsOfUse />;
    }
    
    return <MainContent />;
  };

  return (
    <ContentProvider>
        <Preloader />
        {renderRoute()}
        {/* תפריט נגישות — מוצג בכל עמודי האתר */}
        <AccessibilityWidget />
    </ContentProvider>
  );
};

export default App;
