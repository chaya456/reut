import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Logo from './Logo';
import { useContent } from '../context/ContentContext';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });
  const { content } = useContent();

  // Helper to split text into characters
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="hero-char inline-block will-change-transform origin-bottom"
        style={{ opacity: 0 }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
        // --- 1. Logo Animation ---
        const tl = gsap.timeline({ delay: 0.2 });

        tl.fromTo("#logo-character", 
            { scale: 0, opacity: 0, transformOrigin: "center center" },
            { scale: 1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" }
        );

        tl.fromTo("#logo-ball",
            { y: -200, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.0, ease: "bounce.out" },
            "-=0.8"
        );
        
        tl.to("#logo-ball", {
            y: -15, 
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "circ.out", 
        });

        // --- 2. Text Animation ---
        // Need to wait for react render of new text, so we use a slight delay or just target class
        // Re-run animation if text changes significantly? 
        // For simplicity in CMS mode, we just run once on mount.
        const chars = document.querySelectorAll('.hero-char');
        gsap.fromTo(chars, 
          { y: 80, opacity: 0, scale: 0.9 },
          { 
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.5)", delay: 0.5 
          }
        );

        gsap.fromTo(".hero-subtitle", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.0, delay: 1.2, ease: "power3.out" }
        );

        gsap.fromTo(".hero-tagline", 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 1.4, ease: "power2.out" }
        );
    }, containerRef);

    return () => ctx.revert();
  }, [content.hero]); // Re-run if hero content changes

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: `${x}px`, y: `${y}px` });
  };

  const scrollToContact = () => {
      const formElement = document.getElementById('contact-form-fields');
      if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
          const contactSection = document.getElementById('contact');
          if(contactSection) contactSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  };

  return (
    <section 
      className="fixed top-0 left-0 w-full h-screen z-[1] overflow-hidden"
    >
      <div 
        ref={containerRef}
        className="relative w-full h-full bg-white overflow-hidden" 
        id="reveal-hero"
        onMouseMove={handleMouseMove}
      >
        {/* BACKGROUND LAYERS */}
        <div className="absolute inset-0 w-full h-full z-0">
            <img 
                src="https://i.postimg.cc/pL7M6mVG/hry.jpg" 
                alt="After" 
                className="w-full h-full object-cover object-left" 
            />
        </div>

        <div 
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
            style={{
                maskImage: `radial-gradient(circle 300px at ${mousePos.x} ${mousePos.y}, transparent 0%, black 100%)`,
                WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x} ${mousePos.y}, transparent 0%, black 100%)`
            }}
        >
            <img 
                src="https://i.postimg.cc/HLy1DTj3/lpny.jpg" 
                alt="Before" 
                className="w-full h-full object-cover object-left"
            />
        </div>

        {/* CONTENT LAYER */}
        <div className="absolute inset-0 z-20 pointer-events-auto dir-rtl flex flex-col justify-center px-[5vw]">
            
            <div className="w-full max-w-[950px] flex flex-col items-start relative">
                
                {/* 1. Logo */}
                <div className="w-[clamp(140px,20vw,270px)] mb-[1vh] md:translate-y-16">
                     <Logo className="w-full h-full text-white" animated={false} />
                </div>

                {/* 2. Text Block */}
                <div className="text-right w-full">
                    <h1 className="hero-title text-[clamp(48px,9vw,130px)] font-extrabold leading-[0.9] mb-[2vh] drop-shadow-md text-white cursor-default">
                        <div className="block overflow-hidden">
                            {splitText(content.hero.titleLine1 + " ")}
                            <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">
                                {splitText(content.hero.titleLine2)}
                            </span>
                        </div>
                        <div className="block overflow-hidden">
                            {splitText(content.hero.titleLine3)}
                        </div>
                    </h1>

                    {/* Subtitle */}
                    <div className="overflow-hidden mb-[3vh]">
                        <h2 className="hero-subtitle text-[clamp(18px,2.5vw,36px)] font-light text-brand-dark drop-shadow-md pointer-events-none tracking-wide">
                        {content.hero.subtitle}
                        </h2>
                    </div>

                    {/* Button */}
                    <div className="hero-tagline relative z-50">
                        <button 
                            onClick={scrollToContact}
                            className="text-[clamp(16px,1.5vw,22px)] font-medium px-[4vw] py-[2vh] bg-brand-dark border-2 border-brand-dark rounded-none text-white transition-all duration-300 hover:bg-white hover:text-brand-dark shadow-lg backdrop-blur-sm cursor-pointer transform hover:scale-105"
                        >
                        {content.hero.buttonText}
                        </button>
                    </div>
                </div>

                {/* 3. Invisible Spacer */}
                <div className="w-[clamp(140px,20vw,270px)] mt-[1vh] opacity-0 pointer-events-none select-none" aria-hidden="true">
                    <div className="w-full pt-[100%]"></div>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;