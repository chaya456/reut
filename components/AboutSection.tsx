import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useContent } from '../context/ContentContext';
import EditableText from './editable/EditableText';

interface AboutSectionProps {
    id?: string;
    title: string;
    text: string;
    summary: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ id, title, text, summary }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { isEditMode, updateAbout } = useContent();

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
                {isEditMode ? (
                    <EditableText
                        tagName="h2"
                        value={title}
                        onSave={() => {
                            // Update title in sections
                        }}
                        className="text-[clamp(36px,5vw,70px)] font-extrabold mb-[6vh] leading-tight text-white drop-shadow-md block w-full"
                    />
                ) : (
                    <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold mb-[6vh] leading-tight animate-about-text text-white drop-shadow-md">
                        {title}
                    </h2>
                )}

                {isEditMode ? (
                    <EditableText
                        tagName="div"
                        multiline
                        value={text}
                        onSave={(v) => updateAbout(v)}
                        className="text-[clamp(20px,2.2vw,26px)] leading-tight font-medium whitespace-pre-line text-white max-w-[800px] drop-shadow-sm mb-[10vh] block w-full text-center"
                    />
                ) : (
                    <div className="text-[clamp(20px,2.2vw,26px)] leading-tight font-medium animate-about-text whitespace-pre-line text-white max-w-[800px] drop-shadow-sm mb-[10vh] text-center">
                        {text}
                    </div>
                )}

                <div className="process-summary text-center">
                    {isEditMode ? (
                        <EditableText
                            tagName="p"
                            multiline
                            value={summary}
                            onSave={() => {
                                // Update summary
                            }}
                            className="text-[clamp(20px,2.2vw,26px)] font-light text-white leading-[1.3] max-w-[1000px] mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] whitespace-pre-line block w-full"
                        />
                    ) : (
                        <p className="text-[clamp(20px,2.2vw,26px)] font-light text-white leading-[1.3] max-w-[1000px] mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] whitespace-pre-line">
                            {summary}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
