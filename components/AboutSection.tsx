
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { content } = useContent();
  const text = content.aboutText || "נעים להכיר, אנחנו ב'ערך מוסף' מתמחים בלהפוך כל מוצר פשוט ליצירת אומנות אישית.";

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;

      const chars = textRef.current.querySelectorAll('.about-char');
      
      gsap.fromTo(chars, 
        { opacity: 0, display: 'none' },
        { 
          opacity: 1, 
          display: 'inline',
          stagger: 0.03,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%", 
            end: "bottom 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      const heading = sectionRef.current?.querySelector('h2');
      if (heading) {
        gsap.fromTo(heading,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 70%" } }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [text]);

  const renderChars = () => {
    return text.split('').map((char, i) => (
      <span key={i} className="about-char hidden">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section 
        ref={sectionRef} 
        className="py-[15vh] px-[5vw] relative z-20 bg-brand-dark flex flex-col items-center justify-center text-center text-white"
        style={{ clipPath: 'polygon(0 0, 100% 5vh, 100% 100%, 0 95vh)' }}
    >
        <div className="max-w-[1000px] w-full relative z-10 flex flex-col items-center">
             <h2 className="text-[clamp(36px,5vw,60px)] font-extrabold mb-[5vh] leading-tight drop-shadow-sm">
                תעריכו אותנו
             </h2>
             
             {/* Narrow text container for short lines (~5 words per line) */}
             <div className="w-full max-w-[500px]">
                <div ref={textRef} className="text-[clamp(20px,2.2vw,28px)] font-medium leading-[1.6] text-white/95 dir-rtl text-center min-h-[100px] drop-shadow-sm">
                    {renderChars()}
                </div>
             </div>
        </div>
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-60 h-60 bg-brand-light/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default AboutSection;
