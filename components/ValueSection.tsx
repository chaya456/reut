import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Data Configuration
const galleryData = [
  { id: 1, before: "https://i.postimg.cc/W3VPvdFY/1BEFORE.png", after: "https://i.postimg.cc/NMxvfQR0/1AFTER.jpg" },
  { id: 2, before: "https://i.postimg.cc/50JMVXQW/2BEFORE.jpg", after: "https://i.postimg.cc/4dGTgY7M/2AFTER.jpg" },
  { id: 3, before: "https://i.postimg.cc/Hxt1sTb1/3BEFORE.jpg", after: "https://i.postimg.cc/d19ctJGK/3AFTER.png" },
  { id: 5, before: "https://i.postimg.cc/zBkYXqT8/5BEFORE.jpg", after: "https://i.postimg.cc/tTbHjsng/5AFTER.jpg" },
  { id: 6, before: "https://i.postimg.cc/NMxvfQRr/6BEFORE.jpg", after: "https://i.postimg.cc/ZnKtWXLB/6AFTER.jpg" },
  { id: 7, before: "https://i.postimg.cc/9MBHFcyz/7BEFORE.jpg", after: "https://i.postimg.cc/DZc3y71v/7AFTER.jpg" },
  { id: 8, before: "https://i.postimg.cc/76NrYqSS/8BEFORE.jpg", after: "https://i.postimg.cc/63hx5BCn/8AFTER.jpg" },
  { id: 9, before: "https://i.postimg.cc/RFTxVvwT/9BEFORE.jpg", after: "https://i.postimg.cc/G2jnhbvJ/9AFTER.jpg" },
  { id: 10, before: "https://i.postimg.cc/x8TDXBPb/10BEFORE.jpg", after: "https://i.postimg.cc/Xq7SrtgB/10AFTER.png" },
  { id: 11, before: "https://i.postimg.cc/fyTnV1vF/11BEFORE.png", after: "https://i.postimg.cc/vTHF4CvV/11AFTER.jpg" },
  { id: 12, before: "https://i.postimg.cc/8cPQ7xbh/12BEFORE.jpg", after: "https://i.postimg.cc/Gthw46jv/12AFTER.jpg" },
  { id: 13, before: "https://i.postimg.cc/NFfqKZxx/13BEFORE.jpg", after: "https://i.postimg.cc/gjkFx1KC/13AFTER.jpg" },
  { id: 14, before: "https://i.postimg.cc/j2d0DBh8/14BEFORE.jpg", after: "https://i.postimg.cc/tJCQs8zN/14AFTER.jpg" },
  { id: 15, before: "https://i.postimg.cc/59nWhNxp/15BEFORE.jpg", after: "https://i.postimg.cc/4yLCVwLJ/15AFTER.jpg" },
  { id: 16, before: "https://i.postimg.cc/WzWRgSWb/16BEFORE.jpg", after: "https://i.postimg.cc/c1XGp4s5/16AFTER.jpg" },
  { id: 17, before: "https://i.postimg.cc/NGpv3fg8/17BEFORE.jpg", after: "https://i.postimg.cc/BbYWHNYb/17AFTER.jpg" },
  { id: 18, before: "https://i.postimg.cc/nV0fycH5/18BEFORE.jpg", after: "https://i.postimg.cc/y6vCMYVy/18AFTER.jpg" },
  { id: 19, before: "https://i.postimg.cc/mZ8Wv2b0/19BEFORE.jpg", after: "https://i.postimg.cc/G3qnWhc6/19AFTER.jpg" },
  { id: 20, before: "https://i.postimg.cc/66Yxk59k/20BEFORE.jpg", after: "https://i.postimg.cc/HWB1qsYD/20AFTER.jpg" },
  { id: 21, before: "https://i.postimg.cc/8PcgNQcg/21BEFORE.png", after: "https://i.postimg.cc/8ktg2Pp8/21AFTER.jpg" },
  { id: 22, before: "https://i.postimg.cc/XNQ6R7jj/22BEFORE.jpg", after: "https://i.postimg.cc/J7PCf4r8/22AFTER.jpg" },
  { id: 23, before: "https://i.postimg.cc/BQbf496R/23BEFORE.jpg", after: "https://i.postimg.cc/3JNQY5Nh/23AFTER.jpg" },
  { id: 24, before: "https://i.postimg.cc/k4Cdm26H/24BEFORE.png", after: "https://i.postimg.cc/zXvY8ZvJ/24AFTER.png" }
];

const carouselItems = [...galleryData, ...galleryData]; 

const ValueSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const [activeItem, setActiveItem] = useState(() => {
    const randomIndex = Math.floor(Math.random() * galleryData.length);
    return galleryData[randomIndex];
  });
  
  const [sliderPos, setSliderPos] = useState(50);

  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = carouselItems.length - itemsPerView;

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
    const timer = setInterval(() => { handleNext(); }, 4000);
    return () => clearInterval(timer);
  }, [carouselIndex]);

  useEffect(() => {
    if (carouselTrackRef.current) {
        gsap.to(carouselTrackRef.current, {
            xPercent: (carouselIndex * (100 / itemsPerView)),
            duration: 0.8,
            ease: "power2.inOut"
        });
    }
  }, [carouselIndex]);

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

        {/* 1. Main Comparison Slider - Fluid height */}
        <div 
          ref={sliderRef}
          className="w-full lg:w-10/12 h-[45vh] min-h-[300px] lg:h-[60vh] relative rounded-none overflow-hidden shadow-2xl bg-brand-soft mb-[6vh] cursor-ew-resize select-none border-4 border-white"
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
            <button onClick={handlePrev} className="w-10 h-10 md:w-12 md:h-12 border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="w-full max-w-[900px] overflow-hidden rounded-none dir-rtl">
                <div ref={carouselTrackRef} className="flex w-full" style={{ direction: 'rtl' }}>
                    {carouselItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="w-1/3 shrink-0 px-[1vw]">
                            <div 
                                onClick={() => changeMainDisplay(item)}
                                className="aspect-[4/3] w-full bg-white relative cursor-pointer overflow-hidden shadow-md border-2 border-transparent hover:border-brand-dark group transition-all"
                            >
                                <img src={item.before} className="w-full h-full object-cover absolute inset-0 group-hover:opacity-0 transition-opacity" alt="Before" />
                                <img src={item.after} className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" alt="After" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleNext} className="w-10 h-10 md:w-12 md:h-12 border-2 border-brand-dark flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-all">
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