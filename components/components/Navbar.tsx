
import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Detect scroll to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollspy logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px', // Trigger when section is roughly in the middle
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sectionIds = ['home', 'about-main', 'comparison-main', 'gallery-main', 'testimonials-main', 'contact'];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Special case for home (hero) if it's at the top
    const handleHomeScroll = () => {
        if (window.scrollY < 100) {
            setActiveSection('home');
        }
    };
    window.addEventListener('scroll', handleHomeScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleHomeScroll);
    };
  }, []);

  const links = [
    { name: 'בית', id: 'home' },
    { name: 'אודות', id: 'about-main' },
    { name: 'ערך מוסף', id: 'comparison-main' },
    { name: 'גלריה', id: 'gallery-main' },
    { name: 'המלצות', id: 'testimonials-main' },
    { name: 'צור קשר', id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    
    if (window.location.pathname !== '/') {
      window.location.href = id === 'home' ? '/' : `/#${id}`;
      return;
    }

    if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Special case for Contact: Scroll to the form/content area, not the header
    const targetId = id === 'contact' ? 'contact-form-fields' : id;
    const element = document.getElementById(targetId);
    
    // If exact target not found (e.g. contact-form-fields missing), try original ID
    const finalElement = element || document.getElementById(id);

    if (finalElement) {
        // block: 'center' brings the element to the middle of the viewport
        finalElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] dir-rtl ${
        scrolled 
            ? 'bg-white/85 backdrop-blur-xl shadow-sm py-[1vh]' 
            : 'bg-transparent py-[3vh]'
      }`}
    >
      {/* 
         Using px-[5vw] to match the exact padding of the Hero text container.
         This ensures alignment from edge-to-edge on any screen size.
      */}
      <div className="w-full px-[5vw] flex items-center justify-between">
        
        {/* Desktop Links - Fluid font size */}
        <div className="hidden md:flex items-center gap-[3vw]">
            {links.map((link) => (
                <button 
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-[clamp(16px,1.1vw,22px)] font-medium transition-all duration-300 relative group ${
                        activeSection === link.id ? 'text-brand-dark' : 'text-dark-coal hover:text-brand-dark'
                    }`}
                >
                    {link.name}
                    <span className={`absolute -bottom-1 right-0 h-0.5 bg-brand-dark transition-all duration-300 ${
                        activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </button>
            ))}
        </div>

        {/* Small Logo (Visible ONLY on scroll, Desktop Only) */}
        <div className="hidden md:flex items-center">
            <button 
                onClick={() => scrollToSection('home')}
                className={`transition-all duration-700 ease-out flex items-center relative z-50 focus:outline-none ${
                    scrolled 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 -translate-y-4 invisible'
                }`}
                aria-label="דף הבית"
            >
                <div className="h-[clamp(30px,4vh,50px)] w-auto">
                    <Logo className="w-full h-full text-brand-dark" animated={true} />
                </div>
            </button>
        </div>

        {/* Mobile Layout: Logo on Right, Hamburger on Left */}
        <div className="md:hidden flex w-full items-center justify-between">
            {/* 1. Mobile Logo - Placed first (Right side in RTL) */}
            <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="h-[32px] w-auto">
                    <Logo className="w-full h-full text-brand-dark" animated={false} />
                </div>
            </div>

            {/* 2. Hamburger Button - Placed second (Left side in RTL) */}
             <button 
                className="p-2 text-dark-coal z-[110] relative focus:outline-none -ml-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <div className="w-[clamp(24px,6vw,32px)] flex flex-col items-end gap-[6px]">
                    <span className={`h-[2px] bg-current transition-all duration-300 ${isOpen ? 'w-full rotate-45 translate-y-[8px]' : 'w-full'}`}></span>
                    <span className={`h-[2px] bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-[70%]'}`}></span>
                    <span className={`h-[2px] bg-current transition-all duration-300 ${isOpen ? 'w-full -rotate-45 -translate-y-[8px]' : 'w-full'}`}></span>
                </div>
            </button>
        </div>

        {/* Mobile Menu Backdrop */}
        <div 
            className={`fixed inset-0 bg-dark-coal/40 backdrop-blur-sm z-[100] transition-opacity duration-500 md:hidden ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            onClick={() => setIsOpen(false)}
        />

        {/* Mobile Menu Drawer (Side Panel) */}
        <div 
            className={`fixed top-0 right-0 h-full w-[75vw] max-w-[300px] bg-white z-[105] shadow-2xl flex flex-col items-start justify-start pt-[120px] px-[8vw] gap-[3vh] transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] md:hidden ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            {links.map((link, index) => (
                <button 
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-[clamp(20px,5vw,24px)] font-bold transition-all duration-300 transform w-full text-right border-b border-gray-100 pb-2 ${
                        activeSection === link.id ? 'text-brand-dark' : 'text-dark-coal hover:text-brand-dark'
                    } ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                    style={{ transitionDelay: `${index * 50 + 100}ms` }}
                >
                    {link.name}
                </button>
            ))}
            
            {/* Decorative bottom element */}
            <div className="mt-auto mb-8 w-full opacity-20">
                 <Logo className="w-20 h-auto text-brand-dark mx-auto" animated={false} />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
