
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

const ValueSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content } = useContent();
  const galleryData = content.valueSection;
  
  // Initialize with a random item so it's different every time the component mounts
  const [activeItem, setActiveItem] = useState(() => {
    if (galleryData.length > 0) {
        const randomIndex = Math.floor(Math.random() * galleryData.length);
        return galleryData[randomIndex];
    }
    // Fallback if empty
    return { id: 0, before: "", after: "" };
  });

  // Update active item if data changes and current active is missing or empty
  useEffect(() => {
      if (galleryData.length > 0 && (!activeItem.before || !galleryData.find(i => i.id === activeItem.id))) {
          setActiveItem(galleryData[0]);
      }
  }, [galleryData]);
  
  const [sliderPos, setSliderPos] = useState(50);

  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  
  // Responsive Items Per View
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) setItemsPerView(1);
        else if (window.innerWidth < 1024) setItemsPerView(2);
        else setItemsPerView(3);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safe carousel items logic (duplicate for loop if needed, but handle empty)
  const carouselItems = galleryData.length > 0 ? [...galleryData, ...galleryData] : [];
  const maxIndex = Math.max(0, carouselItems.length - itemsPerView);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
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

        const particleCount = 60; 
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full bg-brand-dark opacity-0 pointer-events-none';
            const size = Math.random() * 3 + 1; 
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * -20}%`;
            sectionRef.current?.appendChild(particle);

            gsap.to(particle, {
                y: "120vh", 
                x: `random(-20, 20)`,
                opacity: `random(0.3, 0.8)`, 
                duration: `random(5, 12)`, 
                delay: `random(0, 10)`, 
                repeat: -1, 
                ease: "none", 
            });
        }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (carouselItems.length === 0) return;
    const timer = setInterval(() => { handleNext(); }, 4000);
    return () => clearInterval(timer);
  }, [carouselIndex, carouselItems.length, itemsPerView]);

  useEffect(() => {
    if (carouselTrackRef.current) {
        gsap.to(carouselTrackRef.current, {
            xPercent: (carouselIndex * (100 / itemsPerView)),
            duration: 0.8,
            ease: "power2.inOut"
        });
    }
  }, [carouselIndex, itemsPerView]);

  const handleNext = () => setCarouselIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
  const handlePrev = () => setCarouselIndex((prev) => prev <= 0 ? maxIndex : prev - 1);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pageX = 'touches' in e ? e.touches[0].pageX : (e as React.MouseEvent).pageX;
    let x = pageX - rect.left - window.scrollX;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    const percentage = (x / rect.width) * 100;
    setSliderPos(percentage);
  };

  const changeMainDisplay = (item: typeof galleryData[0]) => {
    gsap.to(sliderRef.current, { 
        opacity: 0.5, duration: 0.2, 
        onComplete: () => {
            setActiveItem(item);
            setSliderPos(50);
            gsap.to(sliderRef.current, { opacity: 1, duration: 0.2 });
            sliderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
  };

  // If no data, show minimal state or return null
  if (galleryData.length === 0) return null;

  return (
    <section 
        id="value"
        ref={sectionRef} 
        className="py-[15vh] relative overflow-hidden bg-white/50 z-30 flex flex-col justify-center"
        style={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)',
            minHeight: '120vh'
        }}
    >
      
      <div className="max-w-[1400px] mx-auto px-[5vw] w-full relative z-10 flex flex-col items-center">
        <div className="text-center mb-[6vh]">
          {/* Responsive Heading */}
          <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight animate-text">
            <span className="transition-colors duration-300 hover:text-brand-dark cursor-default">ערך</span> מוסף
          </h2>
          <p className="text-[clamp(18px,2vw,28px)] mt-[1vh] opacity-80 animate-text">זו לא הדמיה זו תמונה</p>
        </div>

        {/* 1. Main Comparison Slider - 16:9 Aspect Ratio (Reverted from 4:3) */}
        <div 
          ref={sliderRef}
          className="w-full max-w-[1000px] aspect-[16/9] relative rounded-none overflow-hidden shadow-2xl bg-brand-soft mb-[6vh] cursor-ew-resize select-none border-4 border-white"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          <div className="absolute inset-0 w-full h-full">
            <img src={activeItem.after} alt="After" className="w-full h-full object-cover" draggable={false} />
          </div>
          
          <div 
            ref={beforeContainerRef}
            className="absolute inset-0 w-full h-full border-r-4 border-white z-[2] bg-brand-soft"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
             <img src={activeItem.before} alt="Before" className="w-full h-full object-cover" draggable={false} />
          </div>

          <div 
            className="absolute top-0 bottom-0 w-1 bg-white z-10 pointer-events-none shadow-lg drop-shadow-md"
            style={{ left: `${sliderPos}%` }}
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-none flex items-center justify-center text-brand-dark shadow-md border border-brand-light">
                ⇄
             </div>
          </div>
        </div>

        {/* 2. Controlled Carousel */}
        <div className="w-full flex items-center justify-center gap-4 md:gap-6 select-none mb-[6vh]">
            <button onClick={handlePrev} className="w-10 h-10 md:w-12 md:h-12 border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="w-full max-w-[900px] overflow-hidden rounded-none dir-rtl">
                <div ref={carouselTrackRef} className="flex w-full" style={{ direction: 'rtl' }}>
                    {carouselItems.map((item, idx) => (
                        <div 
                            key={`${item.id}-${idx}`} 
                            className="shrink-0 px-[1vw]"
                            style={{ width: `${100 / itemsPerView}%` }}
                        >
                            <div 
                                onClick={() => changeMainDisplay(item)}
                                className={`
                                    aspect-[16/9] w-full relative cursor-pointer overflow-hidden shadow-md border-2 transition-all group
                                    ${activeItem.id === item.id ? 'border-brand-dark ring-2 ring-brand-light' : 'border-transparent hover:border-brand-dark'}
                                `}
                            >
                                <img src={item.before} className="w-full h-full object-cover absolute inset-0 group-hover:opacity-0 transition-opacity" alt="Before" />
                                <img src={item.after} className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" alt="After" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleNext} className="w-10 h-10 md:w-12 md:h-12 border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
        </div>

        <div className="text-center text-[clamp(18px,2.2vw,28px)] font-bold text-brand-dark pb-10 animate-text">
            מוסיפים חדש כל הזמן! מוזמנים לשוב לביקור
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
