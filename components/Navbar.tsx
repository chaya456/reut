import React, { useState, useEffect } from 'react';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'בית', id: 'home' },
    { name: 'ערך מוסף', id: 'value' },
    { name: 'גלריה', id: 'gallery' },
    { name: 'המלצות', id: 'recommendations' },
    { name: 'צור קשר', id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] dir-rtl ${
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
                    className="text-[clamp(16px,1.1vw,22px)] font-medium text-dark-coal transition-all duration-300 relative group hover:text-brand-dark"
                >
                    {link.name}
                    <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-brand-dark transition-all duration-300 group-hover:w-full"></span>
                </button>
            ))}
        </div>

        {/* Small Logo (Visible ONLY on scroll) */}
        <div className="flex items-center">
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

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex w-full items-center justify-between">
             <button 
                className="p-2 text-dark-coal z-50 relative focus:outline-none -mr-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <div className="w-[clamp(24px,6vw,32px)] flex flex-col items-end gap-[6px]">
                    <span className={`h-[2px] bg-current transition-all duration-300 ${isOpen ? 'w-full rotate-45 translate-y-[8px]' : 'w-full'}`}></span>
                    <span className={`h-[2px] bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-[70%]'}`}></span>
                    <span className={`h-[2px] bg-current transition-all duration-300 ${isOpen ? 'w-full -rotate-45 -translate-y-[8px]' : 'w-full'}`}></span>
                </div>
            </button>

            {/* Mobile Logo logic */}
            <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="h-[32px] w-auto">
                    <Logo className="w-full h-full text-brand-dark" animated={false} />
                </div>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
            className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-[4vh] transition-all duration-500 md:hidden ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
        >
            {links.map((link) => (
                <button 
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className="text-[clamp(24px,7vw,40px)] font-bold text-dark-coal hover:text-brand-dark transition-colors transform hover:scale-105 duration-300"
                >
                    {link.name}
                </button>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;