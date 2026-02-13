import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ValueSection from './components/ValueSection';
import Gallery from './components/Gallery';
import Recommendations from './components/Recommendations';
import Footer from './components/Footer';
import NewsletterModal from './components/NewsletterModal';
import AccessibilityWidget from './components/AccessibilityWidget';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContentProvider } from './context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  return (
    <ContentProvider>
        <div className="min-h-screen bg-brand-soft font-sans">
        <Navbar />
        <Hero />
        <NewsletterModal />
        <AccessibilityWidget />
        <main className="relative z-20 mt-[100vh] bg-brand-soft shadow-[0_-50px_100px_rgba(0,0,0,0.1)]">
            <ValueSection />
            <Gallery />
            <Recommendations />
            <Footer />
        </main>
        </div>
    </ContentProvider>
  );
};

export default App;