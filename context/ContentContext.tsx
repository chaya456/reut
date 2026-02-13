import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContent, GalleryItem, Recommendation } from '../types';

// Default / Initial Data
const defaultContent: AppContent = {
  hero: {
    titleLine1: "מוסיפים",
    titleLine2: "ערך",
    titleLine3: "למוצר",
    subtitle: "אמירה. יצירה. שלמות.",
    buttonText: "המוצר עליכם | הערך עלינו"
  },
  gallery: [
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
  ],
  recommendations: [
      { id: 1, name: "בתיה", image: "https://i.postimg.cc/s2WVcfSg/hmlzh-btyh.png", color: "bg-white" },
      { id: 2, name: "רבקי", image: "https://i.postimg.cc/HxCTPG4g/hmlzh-rbqy.png", color: "bg-brand-soft" },
      { id: 3, name: "פרומי", image: "https://i.postimg.cc/s2Qhh0rk/hmlzh-prwmy.png", color: "bg-white" },
      { id: 4, name: "רוחמה", image: "https://i.postimg.cc/8CJ66nGQ/hmlzh-rwhmh.png", color: "bg-brand-soft" },
      { id: 5, name: "רחלי", image: "https://i.postimg.cc/s2Qhh0zC/hmlzh-rhly.png", color: "bg-white" },
      { id: 6, name: "חני", image: "https://i.postimg.cc/8C49sr9y/hmlzh-hny.jpg", color: "bg-brand-soft" },
      { id: 7, name: "מירב", image: "https://i.postimg.cc/YSRZjmZb/hmlzh-myrb.jpg", color: "bg-white" },
      { id: 8, name: "ריקי", image: "https://i.postimg.cc/1zB24N27/hmlzh-ryqy.jpg", color: "bg-brand-soft" },
  ]
};

interface ContentContextType {
  content: AppContent;
  updateHero: (hero: Partial<AppContent['hero']>) => void;
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (id: number, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: number) => void;
  addRecommendation: (item: Recommendation) => void;
  updateRecommendation: (id: number, item: Partial<Recommendation>) => void;
  deleteRecommendation: (id: number) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(defaultContent);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('reut_site_content');
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved content");
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('reut_site_content', JSON.stringify(content));
  }, [content]);

  const updateHero = (heroData: Partial<AppContent['hero']>) => {
    setContent(prev => ({ ...prev, hero: { ...prev.hero, ...heroData } }));
  };

  const addGalleryItem = (item: GalleryItem) => {
    setContent(prev => ({ ...prev, gallery: [...prev.gallery, item] }));
  };

  const updateGalleryItem = (id: number, itemData: Partial<GalleryItem>) => {
    setContent(prev => ({
      ...prev,
      gallery: prev.gallery.map(item => item.id === id ? { ...item, ...itemData } : item)
    }));
  };

  const deleteGalleryItem = (id: number) => {
    setContent(prev => ({
      ...prev,
      gallery: prev.gallery.filter(item => item.id !== id)
    }));
  };

  const addRecommendation = (item: Recommendation) => {
    setContent(prev => ({ ...prev, recommendations: [...prev.recommendations, item] }));
  };

  const updateRecommendation = (id: number, itemData: Partial<Recommendation>) => {
    setContent(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(item => item.id === id ? { ...item, ...itemData } : item)
    }));
  };

  const deleteRecommendation = (id: number) => {
    setContent(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(item => item.id !== id)
    }));
  };

  const resetContent = () => {
      if(window.confirm("האם את בטוחה שאת רוצה לאפס את כל הנתונים לברירת המחדל?")) {
        setContent(defaultContent);
      }
  };

  return (
    <ContentContext.Provider value={{ 
        content, 
        updateHero, 
        addGalleryItem, 
        updateGalleryItem, 
        deleteGalleryItem,
        addRecommendation,
        updateRecommendation,
        deleteRecommendation,
        resetContent
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
