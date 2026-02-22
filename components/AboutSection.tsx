import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProcessStep } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
    id?: string;
    title: string;
    text: string;
    steps: ProcessStep[];
    summary: string;
}

const CurvedArrow: React.FC<{ direction: 'right-to-left' | 'left-to-right', className?: string }> = ({ direction, className }) => {
    return (
        <div className={`absolute left-1/2 -translate-x-1/2 w-[150px] h-[150px] pointer-events-none ${className}`} style={{ zIndex: 0 }}>
            <svg 
                viewBox="0 0 313.33 310.6" 
                fill="white" 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-full h-full overflow-visible ${direction === 'left-to-right' ? 'scale-x-[-1]' : ''}`}
            >
                <path d="M59.82,137.54a53,53,0,0,1-14.18-16.63,91.54,91.54,0,0,1-8.39-21A160.58,160.58,0,0,1,32.8,77.38c-1-7.64-1.6-15.36-2-23.1a210.53,210.53,0,0,0-.18,23.3,151.52,151.52,0,0,0,2.84,23.27A94.93,94.93,0,0,0,41,123.36a56.76,56.76,0,0,0,15,19.08A49.68,49.68,0,0,0,66.55,149a47.35,47.35,0,0,0,12,3.45c8.22,1.26,16.42.58,24.23-.66s15.4-3.09,22.92-4.64a189,189,0,0,1,22.45-3.58,107.47,107.47,0,0,1,11.18-.5c1.87,0,3.72.13,5.57.19l2.77.26,1.38.13,1.38.19a87.11,87.11,0,0,1,21.4,5.75c.86.35,1.73.66,2.58,1l2.52,1.21a54.08,54.08,0,0,1,5,2.54c1.61.95,3.27,1.81,4.84,2.82l4.68,3.11a26.53,26.53,0,0,1,2.28,1.66l2.23,1.72c1.5,1.15,3,2.27,4.4,3.55l4.28,3.71c1.41,1.26,2.72,2.64,4.08,3.95A182.82,182.82,0,0,1,243.83,192c1.24,1.45,2.34,3,3.48,4.56l3.4,4.63c1.17,1.52,2.2,3.14,3.27,4.74l3.19,4.8a452.87,452.87,0,0,1,22.54,39.62l-25.33-17a2,2,0,0,0-2.78.55,2,2,0,0,0-.17,1.92,2.11,2.11,0,0,0,.72.86l28,18.8a2,2,0,0,0,3.09-1.35l5.2-33.34a2,2,0,0,0-1.67-2.29,2,2,0,0,0-2.29,1.67l-4.7,30.18a320.84,320.84,0,0,0-19.27-41.65l-2.94-5c-1-1.68-1.95-3.39-3-5l-3.2-4.91c-1.08-1.64-2.11-3.3-3.3-4.86l-3.48-4.75-1.76-2.36-1.88-2.27-3.78-4.54-.94-1.14-1-1.08-2-2.16a126.07,126.07,0,0,0-17.65-15.92l-4.91-3.45c-1.65-1.11-3.41-2.09-5.12-3.14s-3.5-2-5.28-2.88l-2.69-1.36c-.91-.43-1.85-.8-2.78-1.2a90.55,90.55,0,0,0-23.25-6.5l-1.5-.22-1.51-.16-3-.3c-2-.09-4-.27-6-.26a111.64,111.64,0,0,0-12,.44c-15.94,1.48-31,6-45.91,8.74-7.41,1.37-14.84,2.12-22,1.19a42.16,42.16,0,0,1-10.35-2.68A43.51,43.51,0,0,1,59.82,137.54Z"/>
            </svg>
        </div>
    );
};

const AboutSection: React.FC<AboutSectionProps> = ({ id, title, text, steps, summary }) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Text animations
            gsap.fromTo('.animate-about-text', 
                { y: 30, opacity: 0 },
                { 
                    y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2,
                    scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
                }
            );

            // Steps reveal animation
            const stepElements = gsap.utils.toArray<HTMLElement>('.process-step');
            stepElements.forEach((step) => {
                gsap.fromTo(step, 
                    { y: 30, opacity: 0 },
                    { 
                        y: 0, opacity: 1, duration: 0.8,
                        scrollTrigger: {
                            trigger: step,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Summary reveal
            gsap.fromTo('.process-summary', 
                { y: 30, opacity: 0 },
                { 
                    y: 0, opacity: 1, duration: 1,
                    scrollTrigger: {
                        trigger: '.process-summary',
                        start: "top 90%"
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const scrollToContact = (e: React.MouseEvent) => {
        e.preventDefault();
        const contactElement = document.getElementById('contact');
        if (contactElement) {
            contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <section 
            id={id} 
            ref={sectionRef}
            className="pt-[15vh] pb-[30vh] relative z-30 bg-[#FCA872] text-white"
            style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 15vw), 0 100%)',
                marginBottom: '-15vw'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-[5vw] text-center flex flex-col items-center">
                <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold mb-[6vh] leading-tight animate-about-text text-white drop-shadow-md">
                    {title}
                </h2>
                <div className="text-[clamp(20px,2.2vw,32px)] leading-[1.2] font-medium animate-about-text whitespace-pre-line text-white max-w-[900px] drop-shadow-sm mb-[10vh]">
                    {text}
                </div>

                <div className="timeline-container relative w-full max-w-[600px] mx-auto py-10">
                    <div className="flex flex-col gap-[15vh]"> 
                        {steps.map((step, index) => (
                            <div 
                                key={index}
                                className="process-step relative flex flex-col w-full"
                            >
                                {/* Step Text Container */}
                                <div className={`w-full flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                    <div 
                                        className="w-auto whitespace-nowrap text-center transform transition-transform hover:scale-105 duration-300"
                                    >
                                        {step.isLink ? (
                                            <button 
                                                onClick={scrollToContact}
                                                className="text-[clamp(22px,3vw,38px)] font-normal text-white hover:text-black transition-all underline underline-offset-8 decoration-2 drop-shadow-md"
                                            >
                                                {step.text}
                                            </button>
                                        ) : (
                                            <div className="text-[clamp(22px,3vw,38px)] font-normal text-white drop-shadow-md">
                                                {step.text}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow to next step */}
                                {index < steps.length - 1 && (
                                    <CurvedArrow 
                                        direction={index % 2 === 0 ? 'left-to-right' : 'right-to-left'} 
                                        className={`
                                            top-[90%] 
                                            left-1/2 -translate-x-1/2
                                            w-[250px] h-[150px]
                                        `}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="process-summary mt-[20vh] text-center">
                    <p className="text-[clamp(18px,2.5vw,32px)] font-light text-white leading-[1.3] max-w-[1000px] mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] whitespace-pre-line">
                        {summary}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
