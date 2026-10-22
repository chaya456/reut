
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useContent } from '../context/ContentContext';
import { ValueItem } from '../types';
import EditableText from './editable/EditableText';
import EditableImage from './editable/EditableImage';
import LazyImage from './LazyImage';
import SectionCTA from './SectionCTA';

interface ValueSectionProps {
    id?: string;
    data?: { items: ValueItem[], text?: string };
    title?: string;
    subtitle?: string;
}

const ValueSection: React.FC<ValueSectionProps> = ({ id, data, title, subtitle }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { content, isEditMode, updateValueItem } = useContent();
  
  const galleryData = data?.items || content.valueSection;
  const sectionTitle = title || "ערך מוסף";
  const sectionSubtitle = subtitle || "זו לא הדמיה זו תמונה";
  const sectionText = data?.text;
  
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

  // Carousel items — no duplication (duplicating doubled the number of images the
  // browser had to download; the arrows already clamp to the real range).
  const carouselItems = galleryData;

  // 3 תמונות שמוצגות בצד (לצד התמונה הגדולה), עם גלישה מעגלית ברשימה.
  const visibleThumbs = carouselItems.length
    ? Array.from({ length: Math.min(3, carouselItems.length) }, (_, k) => carouselItems[(carouselIndex + k) % carouselItems.length])
    : [];

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

        // Floating particles are purely decorative. They run an infinite animation, so
        // we skip them on mobile and when the user prefers reduced motion, and keep the
        // count low on desktop — this keeps scrolling smooth on weaker devices.
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.innerWidth < 768;
        const particleCount = prefersReducedMotion || isMobile ? 0 : 12;
        const particles: HTMLDivElement[] = [];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute rounded-full bg-brand-dark opacity-0 pointer-events-none z-0';
            const size = Math.random() * 3 + 1; 
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * -10}%`;
            sectionRef.current?.appendChild(particle);
            particles.push(particle);

            gsap.to(particle, {
                y: "110vh", 
                x: `random(-20, 20)`,
                opacity: `random(0.2, 0.5)`, 
                duration: `random(8, 15)`, 
                delay: `random(0, 10)`, 
                repeat: -1, 
                ease: "none", 
            });
        }

        return () => {
            particles.forEach(p => p.remove());
        };
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

  const handleNext = () => setCarouselIndex((prev: number) => carouselItems.length ? (prev + 1) % carouselItems.length : 0);
  const handlePrev = () => setCarouselIndex((prev: number) => carouselItems.length ? (prev - 1 + carouselItems.length) % carouselItems.length : 0);

  const handleMainNext = () => {
    const currentIndex = galleryData.findIndex(item => item.id === activeItem.id);
    const nextIndex = (currentIndex + 1) % galleryData.length;
    changeMainDisplay(galleryData[nextIndex]);
  };

  const handleMainPrev = () => {
    const currentIndex = galleryData.findIndex(item => item.id === activeItem.id);
    const prevIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    changeMainDisplay(galleryData[prevIndex]);
  };

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
        id={id || "value"}
        ref={sectionRef} 
        className="py-[3vh] relative overflow-hidden bg-white/50 z-30 flex flex-col justify-center"
        style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)',
            minHeight: '100vh'
        }}
    >
      
      <div className="max-w-[1400px] mx-auto px-[5vw] w-full relative z-10 flex flex-col items-center">
        <div className="text-center mb-[2.5vh]">
          {/* Responsive Heading */}
          {isEditMode ? (
            <div className="flex flex-col items-center gap-2">
                <EditableText tagName="h2" value={sectionTitle} onSave={() => {}} className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight" />
                <EditableText tagName="p" value={sectionSubtitle} onSave={() => {}} className="text-[clamp(18px,2vw,28px)] mt-[1vh] opacity-80" />
            </div>
          ) : (
            <>
                <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight animate-text">
                    <span className="transition-colors duration-300 hover:text-brand-dark cursor-default">{sectionTitle.split(' ')[0]}</span> {sectionTitle.split(' ').slice(1).join(' ')}
                </h2>
                <p className="text-[clamp(18px,2vw,28px)] mt-[1vh] opacity-80 animate-text">{sectionSubtitle}</p>
            </>
          )}
        </div>

        {/* Main comparison + side thumbnails (3 images beside the big image) */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-[1.5vw] mb-[3vh]">

        {/* 1. Main Comparison Slider (enlarged) */}
        <div
          ref={sliderRef}
          className="w-full md:flex-1 md:max-w-[920px] aspect-[16/9] relative rounded-none overflow-hidden shadow-2xl bg-brand-soft cursor-ew-resize select-none border-4 border-white group/slider"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          <div className="absolute inset-0 w-full h-full">
            {isEditMode ? (
                <EditableImage 
                    src={activeItem.after} 
                    onUpload={(url) => updateValueItem(activeItem.id, { after: url })} 
                    aspectRatio="aspect-auto w-full h-full"
                />
            ) : (
                <img src={activeItem.after} alt={`${sectionTitle} - אחרי מיתוג וחריטה`} className="w-full h-full object-cover" draggable={false} loading="lazy" />
            )}
          </div>
          
          <div 
            ref={beforeContainerRef}
            className="absolute inset-0 w-full h-full border-r-4 border-white z-[2] bg-brand-soft"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
             {isEditMode ? (
                <EditableImage 
                    src={activeItem.before} 
                    onUpload={(url) => updateValueItem(activeItem.id, { before: url })} 
                    aspectRatio="aspect-auto w-full h-full"
                />
            ) : (
                <img src={activeItem.before} alt={`${sectionTitle} - לפני מיתוג וחריטה`} className="w-full h-full object-cover" draggable={false} loading="lazy" />
            )}
          </div>

          <div 
            className="absolute top-0 bottom-0 w-1 bg-white z-10 pointer-events-none shadow-lg drop-shadow-md"
            style={{ left: `${sliderPos}%` }}
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-none flex items-center justify-center text-brand-dark shadow-md border border-brand-light">
                ⇄
             </div>
          </div>

          {/* Main Slider Navigation Arrows */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleMainPrev(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all z-30 opacity-0 group-hover/slider:opacity-100"
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleMainNext(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all z-30 opacity-0 group-hover/slider:opacity-100"
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        </div>

        {/* Side thumbnails: 3 images beside the main comparison */}
        <div className="flex md:flex-col items-center justify-center gap-2 md:gap-3 shrink-0 w-full md:w-[230px]">
            <button onClick={handlePrev} aria-label="הקודם" className="w-9 h-9 border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all shrink-0">
                <svg className="md:-rotate-90" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="flex md:flex-col gap-2 md:gap-3 w-full">
                {visibleThumbs.map((item, idx) => (
                    <div
                        key={`${item.id}-${idx}`}
                        onClick={() => changeMainDisplay(item)}
                        className={`aspect-[16/9] w-full relative cursor-pointer overflow-hidden shadow-md border-2 transition-all group ${activeItem.id === item.id ? 'border-brand-dark ring-2 ring-brand-light' : 'border-transparent hover:border-brand-dark'}`}
                    >
                        <LazyImage src={item.before} className="w-full h-full object-cover absolute inset-0 group-hover:opacity-0 transition-opacity" alt={`${sectionTitle} - לפני`} />
                        <LazyImage src={item.after} className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" alt={`${sectionTitle} - אחרי`} />
                    </div>
                ))}
            </div>

            <button onClick={handleNext} aria-label="הבא" className="w-9 h-9 border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all shrink-0">
                <svg className="md:-rotate-90" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
        </div>

        </div>{/* end main + thumbnails row */}

        {sectionText && (
            isEditMode ? (
                <EditableText tagName="p" multiline value={sectionText} onSave={() => {}} className="text-[clamp(16px,1.5vw,22px)] opacity-80 max-w-[800px] mx-auto mb-[3vh] block w-full text-center" />
            ) : (
                <p className="text-[clamp(16px,1.5vw,22px)] opacity-80 max-w-[800px] mx-auto mb-[3vh] animate-text">
                    {sectionText}
                </p>
            )
        )}

        <SectionCTA label="יש לי מוצר שמחכה לקבל ערך" className="mt-[2vh]" />
      </div>
    </section>
  );
};

export default ValueSection;
