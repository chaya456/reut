
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const Recommendations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { content } = useContent();

  const reviews = content.recommendations.filter(item => !item.isHidden);
  // Duplicate list for infinite loop
  const marqueeItems = [...reviews, ...reviews];

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Title Animation
        const texts = gsap.utils.toArray<HTMLElement>('.animate-text');
        texts.forEach((text) => {
            gsap.fromTo(text, 
                { y: 30, opacity: 0 },
                { 
                    y: 0, opacity: 1, duration: 1, ease: "power3.out",
                    scrollTrigger: { trigger: text, start: "top 90%" }
                }
            );
        });

        // Infinite Marquee Animation (Left to Right)
        if (marqueeRef.current) {
            // Slower duration for readability (approx 5s per item)
            const duration = reviews.length * 5; 
            
            gsap.fromTo(marqueeRef.current, 
                { xPercent: -50 }, // Start from the second set (Left side)
                { 
                    xPercent: 0,   // Move to the first set (Right side)
                    duration: duration, 
                    ease: "none", 
                    repeat: -1 
                }
            );
        }
    }, containerRef);
    return () => ctx.revert();
  }, [reviews.length]);

  return (
    <section 
        id="recommendations"
        className="relative z-10 -mt-[15vw] bg-transparent overflow-hidden" 
        style={{ 
            paddingTop: '20vw',
            paddingBottom: 'calc(10vw + 150px)' 
        }}
    >
      <div ref={containerRef} className="flex flex-col items-center justify-start relative w-full">
        <div className="max-w-[1400px] w-full mx-auto px-[5vw] text-center mb-[6vh] relative z-20">
            <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight animate-text text-dark-coal">
                <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">מעריכים</span> אותנו
            </h2>
        </div>
        
        {/* Infinite Marquee Container */}
        <div className="w-full overflow-hidden" dir="ltr">
            <div 
                ref={marqueeRef}
                className="flex w-max"
            >
                {marqueeItems.map((rec, index) => (
                    <div key={`${rec.id}-${index}`} className="px-3"> {/* Spacer Wrapper */}
                        <div 
                            className={`
                                relative w-[300px] md:w-[350px] h-[240px] p-3 shrink-0
                                shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] 
                                flex flex-col items-center justify-between text-center 
                                border border-brand-dark/10 rounded-xl transition-shadow duration-300
                                ${rec.color === 'bg-brand-soft' ? 'bg-[#fff5ec]' : 'bg-white'}
                            `}
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-3 right-3 text-brand-dark/20 z-10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                            </div>

                            <div className="w-full flex-1 min-h-0 relative rounded-sm overflow-hidden flex items-center justify-center mb-2">
                                <img src={rec.image} alt={rec.name} className="w-full h-full object-contain object-center" />
                            </div>
                            <div className="shrink-0 w-full border-t border-brand-dark/10 pt-2">
                                <h4 className="text-lg font-bold text-dark-coal/90">{rec.name}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Recommendations;
