
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContentProvider, useContent } from './context/ContentContext';
import SectionRenderer from './components/SectionRenderer';

gsap.registerPlugin(ScrollTrigger);

const MainContent = () => {
    const { content } = useContent();
    const [isAdmin, setIsAdmin] = React.useState(false);

    // Separate Hero sections because they are fixed/background elements
    const heroSections = content.sections.filter(s => s.type === 'hero');
    const contentSections = content.sections.filter(s => s.type !== 'hero');

    return (
        <div className="min-h-screen bg-brand-soft font-sans">
            <Navbar isAdmin={isAdmin} onToggleAdmin={() => setIsAdmin(!isAdmin)} />
            
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

            {/* Hidden Admin Toggle - For Client Use */}
            <button 
                onClick={() => setIsAdmin(!isAdmin)}
                className="fixed bottom-4 right-4 z-[999] w-8 h-8 opacity-0 hover:opacity-20 transition-opacity cursor-default"
                title="Toggle Management Mode"
            />
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
