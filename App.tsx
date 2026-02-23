
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContentProvider, useContent } from './context/ContentContext';
import SectionRenderer from './components/SectionRenderer';
import AdminPanel from './components/AdminPanel';

gsap.registerPlugin(ScrollTrigger);

const MainContent = () => {
    const { content, isAdmin, showAdminPanel, setShowAdminPanel, login } = useContent();
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);
    const [passwordInput, setPasswordInput] = React.useState('');
    const [loginError, setLoginError] = React.useState(false);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(passwordInput);
        if (success) {
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
        <div className="min-h-screen bg-brand-soft font-sans">
            <Navbar />
            
            {/* Hero Sections (Fixed Background) */}
            {heroSections.map(section => (
                <SectionRenderer key={section.id} section={section} isAdmin={isAdmin} />
            ))}

            {/* Main Scrollable Content */}
            <main className="relative z-20 mt-[100vh] bg-brand-soft shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md relative animate-[fadeIn_0.3s_ease-out]">
                        <button 
                            onClick={() => { setShowPasswordModal(false); setPasswordInput(''); setLoginError(false); }}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold text-center mb-6 text-dark-coal">כניסה למערכת ניהול</h3>
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <input 
                                    type="password" 
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="סיסמה"
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-dark text-right"
                                    autoFocus
                                />
                            </div>
                            {loginError && <p className="text-red-500 text-sm text-center">סיסמה שגויה</p>}
                            <button 
                                type="submit"
                                className="w-full bg-brand-dark text-white py-3 rounded font-bold hover:bg-black transition-colors"
                            >
                                כניסה
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Admin Panel */}
            <AdminPanel isOpen={showAdminPanel && isAdmin} onClose={() => setShowAdminPanel(false)} />
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
