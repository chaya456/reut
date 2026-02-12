import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Define the structure for a project item
interface ProjectItem {
  id: number;
  title: string;
  thumbnail: string;
  size: 'large' | 'small' | 'tall'; // For grid layout control
  images: string[]; // Images to show in lightbox
}

const Gallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // New Data from User
  const galleryItems: ProjectItem[] = [
      { 
        id: 1, 
        title: "אירוסין", 
        thumbnail: "https://i.postimg.cc/DwV5DXct/DSC01640.jpg",
        size: 'large', 
        images: [
            "https://i.postimg.cc/DwV5DXct/DSC01640.jpg",
            "https://i.postimg.cc/HkG3Ky2C/DSC01658.jpg",
            "https://i.postimg.cc/wjKFPmVM/DSC01679.jpg",
            "https://i.postimg.cc/fR45F9KL/DSC01681.jpg",
            "https://i.postimg.cc/vBmv9LQx/DSC02031.jpg",
            "https://i.postimg.cc/VNgRdHcB/DSC02039.jpg"
        ]
      },
      { 
        id: 2, 
        title: "יומולדת", 
        thumbnail: "https://i.postimg.cc/9XsF6mq0/tpt-swlhn.jpg",
        size: 'tall', 
        images: [
            "https://i.postimg.cc/9XsF6mq0/tpt-swlhn.jpg",
            "https://i.postimg.cc/Y0FkrFmS/kws-wphyt.jpg",
            "https://i.postimg.cc/DfRy9vbw/phyt.jpg",
            "https://i.postimg.cc/vTnMYn6n/phyt-wkws.jpg",
            "https://i.postimg.cc/sfG39kHq/pytwt.jpg"
        ]
      },
      { 
        id: 3, 
        title: "יום נישואין", 
        thumbnail: "https://i.postimg.cc/MTMRR6CK/zlht.jpg", 
        size: 'small', 
        images: [
            "https://i.postimg.cc/MTMRR6CK/zlht.jpg", 
            "https://i.postimg.cc/KcnVgBtQ/1B4A6988.jpg", 
            "https://i.postimg.cc/023WG43d/swlhn-'lkswn.jpg",
            "https://i.postimg.cc/qB1ZqqGN/swlhn-mlm'lh.jpg",
            "https://i.postimg.cc/xdV6hz9h/swlhn-rwhb.jpg",
            "https://i.postimg.cc/W4c5CksW/sqyq.jpg"
        ]
      },
      { 
        id: 4, 
        title: "שבע ברכות", 
        thumbnail: "https://i.postimg.cc/7LpX0JWf/freepik-img1-img2-37235.jpg",
        size: 'small', 
        images: [
            "https://i.postimg.cc/7LpX0JWf/freepik-img1-img2-37235.jpg",
            "https://i.postimg.cc/GmgX35P6/kws.jpg",
            "https://i.postimg.cc/xdktX3gs/zlht.jpg",
            "https://i.postimg.cc/k5Vf2vf2/swlhn-'rwk.jpg",
            "https://i.postimg.cc/Bb3gw9st/swlhn-mlm'lh.jpg"
        ]
      },
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

        const items = gsap.utils.toArray<HTMLElement>('.gallery-item');
        gsap.fromTo(items, 
            { y: 60, opacity: 0 },
            { 
                y: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.15,
                scrollTrigger: { trigger: ".gallery-grid", start: "top 80%" }
            }
        );

    }, galleryRef);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (lightboxOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingLeft = `${scrollbarWidth}px`; 
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingLeft = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingLeft = '';
    };
  }, [lightboxOpen]);

  const openLightbox = (project: ProjectItem) => {
    setCurrentProject(project);
    setCurrentImageIndex(0);
    setIsImageLoading(true);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentProject(null);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProject) return;
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev + 1) % currentProject.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentProject) return;
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev - 1 + currentProject.images.length) % currentProject.images.length);
  };

  return (
    <>
        <section 
            id="gallery"
            ref={galleryRef} 
            className="py-[10vh] pb-[20vh] relative z-20 -mt-[15vw] flex flex-col justify-center bg-gradient-to-br from-brand-soft via-brand-light/30 to-brand-soft"
            style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 92%)',
                paddingTop: '20vw', 
                minHeight: '120vh'
            }}
        >
        <div className="max-w-[1400px] mx-auto px-[5vw] w-full">
            <div className="text-center mb-[8vh] pt-0">
            <h2 className="text-[clamp(36px,5vw,70px)] font-extrabold m-0 leading-tight text-dark-coal animate-text">
                <span className="transition-colors duration-300 hover:text-brand-dark cursor-default inline-block">ערכנו</span> שולחן
            </h2>
            </div>

            {/* Fluid Grid */}
            <div className="gallery-grid grid grid-cols-1 md:grid-cols-4 auto-rows-[min(300px,35vh)] gap-[1.5vw]">
                {galleryItems.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => openLightbox(item)}
                        className={`
                            gallery-item relative group cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl border-2 border-white/50
                            ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                            ${item.size === 'tall' ? 'md:col-span-1 md:row-span-2' : ''}
                            ${item.size === 'small' ? 'md:col-span-1 md:row-span-1' : ''}
                        `}
                    >
                        {/* Removed zoom transition group-hover:scale-110 to fix perceived bug */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${item.thumbnail}')` }}
                        />
                        <div className="absolute inset-0 bg-brand-dark/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col items-center justify-center text-white p-6 text-center">
                            <span className="text-4xl font-light mb-2">+</span>
                            <h3 className="text-2xl font-bold">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </section>

        {/* Lightbox Modal */}
        {lightboxOpen && currentProject && (
            <div 
                className="fixed inset-0 z-[100] bg-dark-coal/95 backdrop-blur-md flex items-center justify-center p-[4vw] animate-[fadeIn_0.3s_ease-out]"
                onClick={closeLightbox}
            >
                <button 
                    className="absolute top-[2vh] right-[2vw] text-white/50 hover:text-white text-[clamp(24px,3vw,48px)] z-50 transition-colors"
                    onClick={closeLightbox}
                >
                    ✕
                </button>

                <div className="relative w-full max-w-6xl h-full max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        {isImageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                <div className="w-10 h-10 border-4 border-white/20 border-t-brand-dark rounded-full animate-spin"></div>
                            </div>
                        )}

                        <img 
                            key={`${currentProject.id}-${currentImageIndex}`}
                            src={currentProject.images[currentImageIndex]} 
                            alt={currentProject.title} 
                            onLoad={() => setIsImageLoading(false)}
                            className={`max-w-full max-h-[70vh] object-contain shadow-2xl origin-center z-10 transition-opacity duration-300 ease-out will-change-opacity ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                        />
                        
                        {currentProject.images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-[5vw] h-[5vw] min-w-[40px] min-h-[40px] text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 z-20">
                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                                <button onClick={nextImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-[5vw] h-[5vw] min-w-[40px] min-h-[40px] text-white/70 hover:text-white flex items-center justify-center transition-all hover:scale-110 z-20">
                                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                            </>
                        )}
                    </div>

                    <div className="w-full mt-[2vh] flex flex-col md:flex-row items-center justify-between text-white">
                        <div className="text-right">
                            <h3 className="text-[clamp(20px,2.5vw,30px)] font-bold">{currentProject.title}</h3>
                        </div>
                        
                        <div className="flex gap-2 mt-[2vh] md:mt-0 overflow-x-auto pb-2">
                            {currentProject.images.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={(e) => { e.stopPropagation(); if (idx !== currentImageIndex) { setIsImageLoading(true); setCurrentImageIndex(idx); } }}
                                    className={`w-[clamp(50px,6vw,80px)] h-[clamp(50px,6vw,80px)] shrink-0 cursor-pointer border-2 transition-all ${idx === currentImageIndex ? 'border-brand-dark opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="thumb" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        )}
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );
};

export default Gallery;