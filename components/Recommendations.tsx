
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';
import { Recommendation } from '../types';

gsap.registerPlugin(ScrollTrigger);

const Recommendations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { content } = useContent();
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

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
            // Slower duration for readability (Increased to 10s per item for slower speed)
            const duration = reviews.length * 10; 
            
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

  const handleNextRec = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedRec) return;
    const currentIndex = reviews.findIndex(r => r.id === selectedRec.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % reviews.length;
    setSelectedRec(reviews[nextIndex]);
  };

  const handlePrevRec = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedRec) return;
    const currentIndex = reviews.findIndex(r => r.id === selectedRec.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
    setSelectedRec(reviews[prevIndex]);
  };

  return (
    <>
        <section 
            id="recommendations"
            className="relative z-10 -mt-[15vw] bg-transparent overflow-hidden" 
            style={{ 
                paddingTop: '20vw',
                paddingBottom: 'calc(10vw + 300px)' 
            }}
        >
          <div ref={containerRef} className="flex flex-col items-center justify-start relative w-full">
            <div className="max-w-[1400px] w-full mx-auto px-[5vw] text-center mb-[6vh] relative z-20">
                <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight animate-text text-dark-coal">
                    <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">מעריכים</span> אותנו
                </h2>
                {/* Instruction text removed */}
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
                                onClick={() => setSelectedRec(rec)}
                                className={`
                                    relative w-[300px] md:w-[350px] h-[240px] p-3 shrink-0 cursor-pointer
                                    shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] 
                                    flex flex-col items-center justify-between text-center 
                                    border border-brand-dark/10 rounded-xl transition-all duration-300 hover:scale-105
                                    ${rec.color === 'bg-brand-soft' ? 'bg-[#fff5ec]' : 'bg-white'}
                                `}
                            >
                                {/* Quote Icon Removed */}

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

        {/* Modal / Lightbox - Without dark backdrop */}
        {selectedRec && (
            <div 
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                onClick={() => setSelectedRec(null)}
            >
                {/* Transparent overlay to catch clicks */}
                <div className="absolute inset-0 bg-transparent" />
                
                <div 
                    className="relative bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 w-[90vw] md:w-[50vw] h-[60vh] md:h-[50vh] flex flex-col overflow-hidden animate-[popIn_0.3s_cubic-bezier(0.16,1,0.3,1)] z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedRec(null)}
                        className="absolute top-4 right-4 z-50 w-8 h-8 text-dark-coal/50 hover:text-dark-coal flex items-center justify-center transition-colors text-xl font-light"
                    >
                        ✕
                    </button>

                    <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-white p-8">
                        {/* Navigation Arrows - Thin and delicate */}
                        <button 
                            onClick={handleNextRec}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-dark-coal/40 hover:text-dark-coal transition-all z-20"
                        >
                             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        
                        <button 
                            onClick={handlePrevRec}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-dark-coal/40 hover:text-dark-coal transition-all z-20"
                        >
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </button>

                        <img 
                            key={selectedRec.id} 
                            src={selectedRec.image} 
                            alt={selectedRec.name} 
                            className="w-full h-full object-contain animate-[fadeIn_0.3s_ease-out]"
                        />
                    </div>
                </div>
            </div>
        )}
        <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </>
  );
};

export default Recommendations;
