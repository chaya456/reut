import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

// Icon Components (kept same)
const EmbroideryIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 283.44 283.44" className={className}>
        <path fill="currentColor" d="M143.76,95.4c.05.18.56.6.82.58,1.42-.48,3.68-.07,5.02-.49.62-.19.42-2.53.39-3.2-.15-3.52-1.9-11.02-4.58-13.42-4.23-3.81-9.86-.95-11.91,3.66-2.26,5.08-1.92,9.71-1.74,15.03.39,11.99,2.19,23.66,3.11,35.53.08,1.04.35,4.53,1.76,4.39,2.23-.77,4.53-1.35,6.77-2.1,5.61-1.88,17.86-6.21,20.55-11.61.59-1.18.68-2.69,1.76-3.52,1.84-1.41,3.66-1.16,4.86.9,1.31,2.25-.15,5.3-1.52,7.24-4.34,6.16-13.76,10.16-20.75,12.61-10.21,3.58-29.41,6.41-36.11,15.25-5.55,7.31-.57,16.4,7.74,18.42,1.08.26,4.52.37,5.22,1.02.61.57,1,2.66.84,3.47-.17.88-1.88,2.16-2.79,2.2-3.52.16-9.55-1.95-12.44-4-7.63-5.41-9.49-15.8-4.88-23.83,3.59-6.25,13.1-10.42,19.68-12.72.77-.27,3.53-.61,3.76-1.28l-3.83-37.37-.19-.29c-.31-.22-4.22.06-4.93.14-10.34,1.09-28.27,6.1-31.21,17.75-.66,2.62.43,5.83-3.21,6.62-2.65.58-4.94-2.06-4.19-4.56.92-3.06,1.92-6.55,3.61-9.27,1.64-2.64,3.81-4.93,6.24-6.86,4.9-3.88,10.82-6.37,16.8-8.05,3.36-.94,7.25-2.09,10.78-2.09,1.16-.12,5.22.25,5.8-.32.51-.51.25-2.82.3-3.66.33-5.86.83-11.36,4.8-16.08,4.61-5.47,13.54-6.24,19.18-1.91s7.41,14.68,7.21,21.55c.17.74,5.01.22,5.87.14,9.98-1.02,25.47-5.07,30.47-14.65.86-1.64,1.95-6.51,3.14-7.18,1.5-.85,4.03-.17,4.71,1.55,1.17,2.96-2.01,9.57-3.86,12.02-8.02,10.65-23.96,13.73-36.36,15-1.14.12-3.56-.32-4.37.54-.55.58-.24,2.78-.29,3.67-.22,3.53-.97,7.23-1.42,10.82-.26,2.02-.19,4.4-.57,6.39-.66,3.42-5.18,5.35-6.89,1.72.23-3.22.72-6.42,1.2-9.6.36-2.39.5-4.8.84-7.19.21-1.5,1.39-4.42.71-5.86-.05-.11-.44-.48-.48-.48h-5.04s-.36.36-.36.36v4.28c0,1.5.63,4.55-.86,5.38-.66.36-1.37.67-2.12.68-4.56.1-3.17-7.95-3.24-10.6-.07-2.62-.27-5.29-.26-7.9,0-1.98-.26-5.16.03-6.96.21-1.29,1.7-2.66,2.99-2.68,1.2-.03,3.48,1.74,3.48,3.15v7.68Z"/>
        <path fill="currentColor" d="M150.53,146.78c.14.08.25.17.33.27.51.71.17,2.71.12,3.56-.31,4.97-1.3,9.99-1.9,14.9-1.73,14.22-3.2,28.42-5.31,42.69-.21,1.43.48,2.27-.91,3.48-1.05.92-3.04,1.01-4.01,0-1.15-1.2-1.31-6.27-1.58-8.02-1.75-11.52-3.16-23.17-4.56-34.8-.44-3.64-.76-7.37-1.19-11.05-.24-2.06-.76-4.17-.94-6.26l.2-.47c.17-.22,3.6-1.5,4.01-1.55,1.74-.2,2.17,3.57,2.43,4.98,1.13,6.13,1.26,12.66,2.25,18.87.58,1.2.35,6.38,2.32,4.06-.05-1.45.39-2.86.52-4.27.66-6.85.71-13.77,1.71-20.61.16-1.11.67-4.08.99-5.01.07-.22.68-.88.78-.9,1.02-.14,3.66-.45,4.73.14Z"/>
    </svg>
);

const EngravingIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 283.44 283.44" className={className}>
        <path fill="currentColor" d="M215.7,130.78c-.96-.58-5.82-17.82-7.31-21.18C174.03,31.69,56.75,53.8,50.55,136.47c-6.92,92.28,119.95,125.67,157.84,41.84,2.12-4.69,4.77-17.69,6.21-19.79,1.65-2.4,5.22-1.7,7.79-1.42,3.78,2.36-3.13,19.92-4.67,23.54-40.81,95.51-186.65,57.95-176.17-47.17,9.11-91.4,137.74-112.94,175.45-27.48,1.77,4,6.87,17.82,6.53,21.44-.31,3.35-5.62,4.7-7.84,3.35Z"/>
        <path fill="currentColor" d="M149.21,139.33c35.88-.45,71.98,1.56,107.89.57,6.5.63,4.72,8.74-1.01,9.11-38.09-1.87-78.26,2.33-116.1-.03-5.37-.33-12.17-.17-8.54-7.62,1.32-1.66,14.47-1.98,17.76-2.02Z"/>
        <path fill="currentColor" d="M129.3,116.22c8.7-1.26,16.94,1.15,23.25,7.23,4.21,4.06,6.88,11.01-1.15,10-5.95-.75-8.21-9.72-20.09-8.24-23.14,2.87-20.73,39.56,3.71,37.77,6.59-.48,17.57-11.66,21.08-6.03,3.7,5.93-13.07,14.28-18.17,14.89-38.76,4.64-43.04-50.62-8.63-55.63Z"/>
    </svg>
);

const CuttingIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 283.44 283.44" className={className}>
        <path fill="currentColor" d="M133.37,165.37c1.17,5.74,12.84,21.06,15.22,28.78.42,1.37,1.14,2.6.77,4.12-6.33,12.53-9.94,27.51-18.6,38.38-64.92-3.31-103.67-75.13-72.56-132.45,11.64-21.45,37.03-41.47,61.78-44.22,2.28-.25,13.39-.93,13.39,2.39v103ZM124.37,68.87c-71.77,9.93-91.54,104.44-32.73,145.23,5.63,3.91,29.1,15.81,34.74,12.3,3.14-1.95,9.66-23.04,12.78-27.27.73-2.23.07-3.92-.58-5.98-1.35-4.29-14.22-23.12-14.22-24.78v-99.5Z"/>
        <path fill="currentColor" d="M161.37,170.37l-16.8-21.85,16.59-26.36,1.14-60.86c3.12-4.39,18.87-.2,23.85,1.29,81.12,24.2,81.42,145.18,0,170.56-3.54,1.1-24.78,6.61-24.78,1.22v-64ZM170.37,226.87c72.9-9.24,93.3-109.88,30.02-147.52-5.51-3.28-21.84-10.49-27.76-10.29-1.22.04-1.55.37-2.26,1.31v55l-15.01,23.02,15.01,18.98v59.5Z"/>
        <path fill="currentColor" className="text-white/40" d="M124.37,68.87v99.5c0,1.66,12.86,20.49,14.22,24.78.65,2.06,1.31,3.76.58,5.98-3.12,4.23-9.64,25.32-12.78,27.27-5.64,3.51-29.11-8.39-34.74-12.3-58.81-40.78-39.04-135.3,32.73-145.23Z"/>
        <path fill="currentColor" className="text-white/40" d="M170.37,226.87v-59.5l-15.01-18.98,15.01-23.02v-55c.71-.94,1.04-1.27,2.26-1.31,5.92-.19,22.25,7.02,27.76,10.29,63.28,37.63,42.88,138.28-30.02,147.52Z"/>
    </svg>
);

const HotStampingIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 283.44 283.44" className={className}>
        <path fill="currentColor" d="M235.92,236.17c-1.08,1.17-5.92,4.42-7.43,4.92l-174.82.32c-7.66-2.59-12.36-9.07-12.9-17.17,3.53-51.62-4.55-109.21,0-160.13,1.14-12.76,8.85-17.9,20.94-18.8,51.65-3.84,107.98,3,160.13,0,12.39,1.35,17.9,9,18.8,20.94,3.82,50.93-2.99,106.55,0,157.98-.14,3.95-2.05,9.06-4.72,11.93ZM58.78,55.27c-6.34,1.62-7.82,6.05-8.35,12.06-4.31,49.31,3.36,104.8,0,154.76-.26,4.57,3.03,8.29,6.95,10.23l162.31,1.04c5.88-.54,8.68-1.71,10.73-7.53V62.51c-1.22-3.65-3.32-5.76-6.99-6.98l-164.65-.26Z"/>
        <path fill="currentColor" className="text-white/40" d="M58.78,55.27l164.65.26c3.66,1.22,5.77,3.33,6.98,6.98v163.32c-2.05,5.82-4.85,6.98-10.73,7.53l-162.31-1.04c-3.92-1.94-7.21-5.66-6.95-10.23,3.37-49.96-4.31-105.45,0-154.76.53-6.01,2.01-10.44,8.35-12.06ZM102.72,83.12c-.9.18-6.14,5.62-7.11,6.84-10.38,13.05-11.84,32.79-4.72,47.64,7.95,16.59,19.38,21.83,12.26,43.68-1.92,5.87-16.44,22.43-4.77,23.06,3.75.2,7.39-6.91,9.21-10.03,5.53-9.46,8.25-18.01,7.32-29.17-1.84-21.94-25.09-33.5-17.72-57.5,1.6-5.22,10.83-16.65,11.07-18.94.25-2.44-3.17-6.03-5.53-5.58ZM143.38,83.31c-5.05.01-13.09,15.02-14.54,19.47-11.74,35.92,21.4,43.18,15.67,74.74-1.53,8.43-10.73,16.91-11.33,20.98-.87,5.91,5.32,7.61,9.66,3.12,7.27-7.5,12.55-23.17,12.49-33.46-.15-23.92-24.19-34.38-18.19-59.24,1.49-6.16,10.93-17.25,11.1-20.16.15-2.53-2.52-5.46-4.85-5.45ZM184.2,83.34c-8.74-.06-17.59,24.89-17.76,32.43-.59,26.77,26.62,37.91,16.98,65.22-1.89,5.35-9.72,15.22-10.04,18.97s4.56,5.28,8.2,2.81c9.43-6.41,14.75-27.8,13.77-38.59-2.12-23.34-25.96-31.58-16.49-58.64,1.81-5.18,9.45-13.31,9.99-15.86.53-2.53-2.01-6.31-4.64-6.32Z"/>
        <path fill="currentColor" d="M184.2,83.34c2.63.02,5.18,3.8,4.64,6.32-.54,2.55-8.18,10.68-9.99,15.86-9.47,27.06,14.37,35.3,16.49,58.64.98,10.79-4.34,32.18-13.77,38.59-3.64,2.47-8.52.92-8.2-2.81s8.16-13.62,10.04-18.97c9.64-27.31-17.57-38.45-16.98-65.22.17-7.54,9.02-32.49,17.76-32.43Z"/>
        <path fill="currentColor" d="M143.38,83.31c2.33,0,5,2.92,4.85,5.45-.17,2.92-9.61,14-11.1,20.16-6,24.85,18.03,35.31,18.19,59.24.06,10.29-5.22,25.96-12.49,33.46-4.34,4.48-10.53,2.79-9.66-3.12.6-4.07,9.8-12.55,11.33-20.98,5.74-31.56-27.41-38.82-15.67-74.74,1.45-4.45,9.49-19.45,14.54-19.47Z"/>
        <path fill="currentColor" d="M102.72,83.12c2.36-.46,5.78,3.13,5.53,5.58-.24,2.29-9.47,13.72-11.07,18.94-7.36,24,15.88,35.56,17.72,57.5.94,11.16-1.79,19.71-7.32,29.17-1.82,3.12-5.46,10.23-9.21,10.03-11.67-.63,2.86-17.19,4.77-23.06,7.13-21.85-4.31-27.09-12.26-43.68-7.12-14.85-5.66-34.58,4.72-47.64.97-1.22,6.21-6.66,7.11-6.84Z"/>
    </svg>
);


const Recommendations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const stickersRef = useRef<HTMLDivElement[]>([]);

  const stickers = [
    { label: "רקמה", Icon: EmbroideryIcon, top: "20%", left: "10%", rotate: -8, color: "text-brand-dark" },
    { label: "חריטה", Icon: EngravingIcon, top: "25%", right: "12%", rotate: 5, color: "text-dark-coal" },
    { label: "חיתוך", Icon: CuttingIcon, top: "70%", left: "15%", rotate: 12, color: "text-dark-coal" },
    { label: "הטבעה", Icon: HotStampingIcon, top: "65%", right: "10%", rotate: -6, color: "text-brand-dark" },
  ];

  useEffect(() => {
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

        cardsRef.current.forEach((card, index) => {
            if (index > 0 && card) {
                gsap.set(card, { yPercent: 200, opacity: 0 });
            }
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top", 
                end: "+=6000", 
                scrub: 1, 
                pin: true,
                anticipatePin: 1
            }
        });

        cardsRef.current.forEach((card, index) => {
            if (index > 0 && card) {
                tl.to(card, {
                    yPercent: 0, 
                    opacity: 1,
                    rotation: index % 2 === 0 ? 2 : -2,
                    duration: 1,
                    ease: "none"
                }, ">-0.2");
            }
        });
        
        tl.to({}, { duration: 0.5 });

        stickersRef.current.forEach((el) => {
            if (!el) return;
            gsap.to(el, {
                y: "random(-20, 20)", 
                x: "random(-10, 10)",
                rotation: "random(-10, 10)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true, 
                ease: "sine.inOut" 
            });
        });

        if (stickersRef.current.length > 0 && containerRef.current) {
            Draggable.create(stickersRef.current, {
                bounds: containerRef.current,
                inertia: true,
                type: "x,y"
            });
        }

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const reviews = [
      { id: 1, name: "בתיה", image: "https://i.postimg.cc/s2WVcfSg/hmlzh-btyh.png", color: "bg-white" },
      { id: 2, name: "רבקי", image: "https://i.postimg.cc/HxCTPG4g/hmlzh-rbqy.png", color: "bg-brand-soft" },
      { id: 3, name: "פרומי", image: "https://i.postimg.cc/s2Qhh0rk/hmlzh-prwmy.png", color: "bg-white" },
      { id: 4, name: "רוחמה", image: "https://i.postimg.cc/8CJ66nGQ/hmlzh-rwhmh.png", color: "bg-brand-soft" },
      { id: 5, name: "רחלי", image: "https://i.postimg.cc/s2Qhh0zC/hmlzh-rhly.png", color: "bg-white" },
      { id: 6, name: "חני", image: "https://i.postimg.cc/8C49sr9y/hmlzh-hny.jpg", color: "bg-brand-soft" },
      { id: 7, name: "מירב", image: "https://i.postimg.cc/YSRZjmZb/hmlzh-myrb.jpg", color: "bg-white" },
      { id: 8, name: "ריקי", image: "https://i.postimg.cc/1zB24N27/hmlzh-ryqy.jpg", color: "bg-brand-soft" },
  ];

  return (
    <section 
        id="recommendations"
        className="relative z-10 -mt-[15vw] bg-transparent" 
        style={{ 
            paddingTop: '20vw',
            paddingBottom: '10vw' 
        }}
    >
      <div ref={containerRef} className="h-screen flex flex-col items-center justify-start overflow-hidden relative">
        <div className="max-w-[1400px] w-full mx-auto px-[5vw] text-center mb-[4vh] pt-[4vh] h-[15vh] relative z-20">
            <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight animate-text text-dark-coal">
                <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">מעריכים</span> אותנו
            </h2>
        </div>
        
        {/* Card Container - Dynamic width */}
        <div className="relative w-full max-w-[min(600px,90vw)] h-[60vh] flex items-center justify-center mt-4 z-10">
            {reviews.map((rec, index) => (
                <div 
                    key={rec.id}
                    ref={(el) => { if(el) cardsRef.current[index] = el; }}
                    className={`absolute inset-0 w-full h-full p-[4vw] shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col items-center justify-between text-center border border-brand-dark/5 ${rec.color}`}
                    style={{ 
                        zIndex: index + 1,
                        transform: index === 0 ? 'rotate(-1deg)' : 'none',
                    }}
                >
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-between gap-[2vh]">
                        <div className="w-full flex-1 min-h-0 relative bg-white/50 rounded-sm overflow-hidden flex items-center justify-center">
                            <img src={rec.image} alt={rec.name} className="w-full h-full object-contain object-center" />
                        </div>
                        <div className="shrink-0">
                            <div className="w-12 h-0.5 bg-brand-dark/30 mx-auto mb-2"></div>
                            <h4 className="text-[clamp(18px,2vw,24px)] font-bold text-dark-coal/80">{rec.name}</h4>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Stickers Layer - Responsive Size */}
        {stickers.map((sticker, idx) => (
            <div 
                key={idx}
                ref={(el) => { if (el) stickersRef.current[idx] = el; }}
                className={`sticker absolute w-[clamp(80px,12vw,140px)] h-[clamp(80px,12vw,140px)] z-[50] cursor-grab pointer-events-auto group active:cursor-grabbing ${sticker.color} transition-colors duration-500`}
                style={{ top: sticker.top, left: sticker.left, right: sticker.right }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 bg-white/90 px-2 py-1 text-xs rounded shadow-sm text-dark-coal whitespace-nowrap">
                    {sticker.label}
                </div>

                <div className="w-full h-full flex items-center justify-center drop-shadow-sm hover:drop-shadow-md transition-all duration-300" style={{ transform: `rotate(${sticker.rotate}deg)` }}>
                    <sticker.Icon className="w-full h-full" />
                </div>
            </div>
        ))}
      </div>
    </section>
  );
};

export default Recommendations;