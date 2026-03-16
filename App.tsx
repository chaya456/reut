
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContentProvider, useContent } from './context/ContentContext';
import SectionRenderer from './components/SectionRenderer';
import AdminPanel from './components/AdminPanel';
import AdminToolbar from './components/editable/AdminToolbar';

gsap.registerPlugin(ScrollTrigger);

const MainContent = () => {
    const { 
        content, isAdmin, setIsEditMode, 
        showAdminPanel, setShowAdminPanel, login 
    } = useContent();
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);
    const [passwordInput, setPasswordInput] = React.useState('');
    const [loginError, setLoginError] = React.useState(false);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(passwordInput);
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
                
                <Footer />
            </main>

            {/* Hidden Admin Trigger - Bottom Left Corner */}
            <div 
                className="fixed bottom-0 left-0 w-12 h-12 z-[9999] cursor-pointer hover:bg-red-500/10 transition-colors"
                onClick={(e) => {
                    // Double click to open
                    if (e.detail === 2) { 
                        if (isAdmin) {
                            setShowAdminPanel(true);
                        } else {
                            setShowPasswordModal(true);
                        }
                    }
                }}
                title="" 
            />

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
            <AdminPanel isOpen={showAdminPanel && isAdmin} onClose={() => setShowAdminPanel(false)} />
            
            {/* Floating Admin Toolbar */}
            <AdminToolbar />
        </div>
    );
};

const App: React.FC = () => {
  useEffect(() => {
    // Refresh ScrollTrigger when app mounts/updates
    ScrollTrigger.refresh();
  }, []);

  return (
    <ContentProvider>
        <MainContent />
    </ContentProvider>
  );
};

export default App;
