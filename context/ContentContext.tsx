
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContent, GalleryItem, Recommendation, ValueItem } from '../types';
import { saveContentToSanity, loadContentFromSanity } from '../services/sanityService';

// Default / Initial Data
const initialValueItems: ValueItem[] = [
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

const initialGalleryItems: GalleryItem[] = [
      { 
        id: 1, 
        title: "אירוסין", 
        description: "חריטה על מקרונים, חיתוך צורני טפט וניל",
        thumbnail: "https://i.postimg.cc/DwV5DXct/DSC01640.jpg",
        size: 'large', 
        images: [
            { url: "https://i.postimg.cc/DwV5DXct/DSC01640.jpg", description: "חריטה על מקרונים" },
            { url: "https://i.postimg.cc/HkG3Ky2C/DSC01658.jpg" },
            { url: "https://i.postimg.cc/wjKFPmVM/DSC01679.jpg" },
            { url: "https://i.postimg.cc/fR45F9KL/DSC01681.jpg", description: "חיתוך צורני טפט וניל" },
            { url: "https://i.postimg.cc/vBmv9LQx/DSC02031.jpg" },
            { url: "https://i.postimg.cc/VNgRdHcB/DSC02039.jpg" }
        ]
      },
      { 
        id: 2, 
        title: "יומולדת", 
        description: "הטבעת חיתוך צורני בחום, חריטה על פחית, חריטה על סביבונים",
        thumbnail: "https://i.postimg.cc/9XsF6mq0/tpt-swlhn.jpg",
        size: 'tall', 
        images: [
            { url: "https://i.postimg.cc/9XsF6mq0/tpt-swlhn.jpg", description: "הטבעת חיתוך צורני בחום" },
            { url: "https://i.postimg.cc/Y0FkrFmS/kws-wphyt.jpg", description: "חריטה על סביבונים" },
            { url: "https://i.postimg.cc/DfRy9vbw/phyt.jpg", description: "חריטה על פחית" },
            { url: "https://i.postimg.cc/vTnMYn6n/phyt-wkws.jpg", description: "חיתוך צורני טפט וניל" },
            { url: "https://i.postimg.cc/sfG39kHq/pytwt.jpg", description: "חריטה על פיתות" }
        ]
      },
      { 
        id: 3, 
        title: "יום נישואין", 
        description: "חיתוך צורני, חריטה על עור, רקמה",
        thumbnail: "https://i.postimg.cc/MTMRR6CK/zlht.jpg", 
        size: 'small', 
        images: [
            { url: "https://i.postimg.cc/MTMRR6CK/zlht.jpg", description: "בד בחיתוך צורני" }, 
            { url: "https://i.postimg.cc/KcnVgBtQ/1B4A6988.jpg", description: "חיתוך צורני טפט וניל" }, 
            { url: "https://i.postimg.cc/023WG43d/swlhn-'lkswn.jpg" },
            { url: "https://i.postimg.cc/qB1ZqqGN/swlhn-mlm'lh.jpg" },
            { url: "https://i.postimg.cc/xdV6hz9h/swlhn-rwhb.jpg" },
            { url: "https://i.postimg.cc/W4c5CksW/sqyq.jpg", description: "חריטה על עור" }
        ]
      },
      { 
        id: 4, 
        title: "שבע ברכות", 
        description: "חיתוך צורני טפט וניל",
        thumbnail: "https://i.postimg.cc/7LpX0JWf/freepik-img1-img2-37235.jpg",
        size: 'small', 
        images: [
            { url: "https://i.postimg.cc/7LpX0JWf/freepik-img1-img2-37235.jpg" },
            { url: "https://i.postimg.cc/GmgX35P6/kws.jpg" },
            { url: "https://i.postimg.cc/xdktX3gs/zlht.jpg", description: "חיתוך צורני טפט וניל" },
            { url: "https://i.postimg.cc/k5Vf2vf2/swlhn-'rwk.jpg" },
            { url: "https://i.postimg.cc/Bb3gw9st/swlhn-mlm'lh.jpg" }
        ]
      },
];

const initialRecommendations: Recommendation[] = [
      { id: 1, name: "בתיה", image: "https://i.postimg.cc/s2WVcfSg/hmlzh-btyh.png", color: "bg-white" },
      { id: 2, name: "רבקי", image: "https://i.postimg.cc/HxCTPG4g/hmlzh-rbqy.png", color: "bg-brand-soft" },
      { id: 3, name: "פרומי", image: "https://i.postimg.cc/s2Qhh0rk/hmlzh-prwmy.png", color: "bg-white" },
      { id: 4, name: "רוחמה", image: "https://i.postimg.cc/8CJ66nGQ/hmlzh-rwhmh.png", color: "bg-brand-soft" },
      { id: 5, name: "רחלי", image: "https://i.postimg.cc/s2Qhh0zC/hmlzh-rhly.png", color: "bg-white" },
      { id: 6, name: "חני", image: "https://i.postimg.cc/8C49sr9y/hmlzh-hny.jpg", color: "bg-brand-soft" },
      { id: 7, name: "מירב", image: "https://i.postimg.cc/YSRZjmZb/hmlzh-myrb.jpg", color: "bg-white" },
      { id: 8, name: "ריקי", image: "https://i.postimg.cc/1zB24N27/hmlzh-ryqy.jpg", color: "bg-brand-soft" },
];

const defaultContent: AppContent = {
  hero: {
    titleLine1: "מוסיפים",
    titleLine2: "ערך",
    titleLine3: "למוצר",
    subtitle: "אמירה. יצירה. שלמות.",
    buttonText: "המוצר עליכם | הערך עלינו"
  },
  aboutText: "נעים להכיר, אנחנו ב'ערך מוסף' מתמחים בלהפוך כל מוצר פשוט ליצירת אומנות אישית.",
  valueSection: initialValueItems,
  gallery: initialGalleryItems,
  recommendations: initialRecommendations,
  sections: [
      {
          id: 'hero-main',
          type: 'hero',
          data: {
            titleLine1: "מוסיפים",
            titleLine2: "ערך",
            titleLine3: "למוצר",
            subtitle: "אמירה. יצירה. שלמות.",
            buttonText: "המוצר עליכם | הערך עלינו"
          }
      },
      {
          id: 'comparison-main',
          type: 'comparison',
          title: 'ערך מוסף',
          subtitle: 'זו לא הדמיה זו תוצאה',
          data: {
              items: initialValueItems,
          }
      },
      {
          id: 'about-main',
          type: 'about',
          title: 'איך מוסיפים ערך?',
          data: {
              text: "אצלנו תשדרגו כל מוצר שברשותכם\nבאמירה ייחודית ויצירתית\nבאמצעות מיתוג אישי ומכשור חדשני:\nחריטה על מגוון חומרים, הטבעה בחום\nוחיתוך צורני מותאם אישית",
              steps: [
                  { text: 'חולמים חלום' },
                  { text: 'מתאימים מוצר' },
                  { text: 'משתפים אותנו', isLink: true },
                  { text: 'בודקים אפשרויות' },
                  { text: 'מעצבים עבורכם' },
                  { text: 'מגשימים לכם חלום' }
              ],
              summary: 'החריטה מתבצעת על כל מוצר יחידנית\nוללא מגע יד אדם'
          }
      },
      {
          id: 'gallery-main',
          type: 'gallery',
          title: 'עורכים לכם שולחן',
          data: {
              items: initialGalleryItems,
          }
      },
      {
          id: 'testimonials-main',
          type: 'testimonial',
          title: 'מעריכים',
          data: {
              items: initialRecommendations
          }
      }
  ]
};

interface ContentContextType {
  content: AppContent;
  updateHero: (hero: Partial<AppContent['hero']>) => void;
  updateAbout: (text: string) => void;
  // Value Section CRUD
  addValueItem: (item: ValueItem) => void;
  updateValueItem: (id: number, item: Partial<ValueItem>) => void;
  deleteValueItem: (id: number) => void;
  // Gallery CRUD
  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (id: number, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: number) => void;
  // Recommendations CRUD
  addRecommendation: (item: Recommendation) => void;
  updateRecommendation: (id: number, item: Partial<Recommendation>) => void;
  deleteRecommendation: (id: number) => void;
  resetContent: () => void;
  isAdmin: boolean;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  hasUnsavedChanges: boolean;
  publishChanges: () => Promise<void>;
  cancelChanges: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(defaultContent);
  const [lastPublishedContent, setLastPublishedContent] = useState<AppContent>(defaultContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load from local storage OR Sanity on mount
  useEffect(() => {
    const loadData = async () => {
      // 1. Try Sanity first
      const sanityData = await loadContentFromSanity();
      if (sanityData) {
        const merged = { ...defaultContent, ...sanityData };
        setContent(merged);
        setLastPublishedContent(merged);
        return;
      }

      // 2. Fallback to Local Storage
      const saved = localStorage.getItem('reut_site_content');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const merged = { ...defaultContent, ...parsed };
          setContent(merged);
          setLastPublishedContent(merged);
        } catch (e) {
          console.error("Failed to parse saved content");
        }
      }
    };
    
    loadData();
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('reut_site_content', JSON.stringify(content));
    
    // Check if content differs from last published
    const isDifferent = JSON.stringify(content) !== JSON.stringify(lastPublishedContent);
    setHasUnsavedChanges(isDifferent);

    // Auto-save to Sanity only if NOT in edit mode (immediate sync for admin panel)
    // In edit mode, we save on blur or publish
    if (!isEditMode && isDifferent) {
      const timer = setTimeout(() => {
        saveContentToSanity(content);
        setLastPublishedContent(content);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, isEditMode, lastPublishedContent]);

  const login = (password: string) => {
      if (password === 'רעות בהצלחה') {
          setIsAdmin(true);
          // Don't auto-open admin panel, let user choose edit mode or panel
          return true;
      }
      return false;
  };

  const logout = () => {
      setIsAdmin(false);
      setIsEditMode(false);
      setShowAdminPanel(false);
  };

  const publishChanges = async () => {
    await saveContentToSanity(content);
    setLastPublishedContent(content);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    alert('השינויים פורסמו בהצלחה!');
  };

  const cancelChanges = () => {
    if (window.confirm('האם לבטל את כל השינויים שלא פורסמו?')) {
      setContent(lastPublishedContent);
      setHasUnsavedChanges(false);
      setIsEditMode(false);
    }
  };

  const updateHero = (heroData: Partial<AppContent['hero']>) => {
    setContent(prev => {
        const newHero = { ...prev.hero, ...heroData };
        return {
            ...prev,
            hero: newHero,
            sections: prev.sections.map(s => s.type === 'hero' ? { ...s, data: newHero } : s)
        };
    });
  };

  const updateAbout = (text: string) => {
    setContent(prev => {
        return {
            ...prev,
            aboutText: text,
            sections: prev.sections.map(s => s.type === 'about' ? { ...s, data: { ...s.data, text: text } } : s)
        };
    });
  };

  // --- Value Section Logic ---
  const addValueItem = (item: ValueItem) => {
    setContent(prev => {
        const newValueSection = [item, ...prev.valueSection];
        return {
            ...prev,
            valueSection: newValueSection,
            sections: prev.sections.map(s => s.type === 'comparison' ? { ...s, data: { ...s.data, items: newValueSection } } : s)
        };
    });
  };

  const updateValueItem = (id: number, itemData: Partial<ValueItem>) => {
    setContent(prev => {
        const newValueSection = prev.valueSection.map(item => item.id === id ? { ...item, ...itemData } : item);
        return {
            ...prev,
            valueSection: newValueSection,
            sections: prev.sections.map(s => s.type === 'comparison' ? { ...s, data: { ...s.data, items: newValueSection } } : s)
        };
    });
  };

  const deleteValueItem = (id: number) => {
    setContent(prev => {
        const newValueSection = prev.valueSection.filter(item => item.id !== id);
        return {
            ...prev,
            valueSection: newValueSection,
            sections: prev.sections.map(s => s.type === 'comparison' ? { ...s, data: { ...s.data, items: newValueSection } } : s)
        };
    });
  };

  // --- Gallery Logic ---
  const addGalleryItem = (item: GalleryItem) => {
    setContent(prev => {
        const newGallery = [...prev.gallery, item];
        return {
            ...prev,
            gallery: newGallery,
            sections: prev.sections.map(s => s.type === 'gallery' ? { ...s, data: { ...s.data, items: newGallery } } : s)
        };
    });
  };

  const updateGalleryItem = (id: number, itemData: Partial<GalleryItem>) => {
    setContent(prev => {
        const newGallery = prev.gallery.map(item => item.id === id ? { ...item, ...itemData } : item);
        return {
            ...prev,
            gallery: newGallery,
            sections: prev.sections.map(s => s.type === 'gallery' ? { ...s, data: { ...s.data, items: newGallery } } : s)
        };
    });
  };

  const deleteGalleryItem = (id: number) => {
    setContent(prev => {
        const newGallery = prev.gallery.filter(item => item.id !== id);
        return {
            ...prev,
            gallery: newGallery,
            sections: prev.sections.map(s => s.type === 'gallery' ? { ...s, data: { ...s.data, items: newGallery } } : s)
        };
    });
  };

  // --- Recommendations Logic ---
  const addRecommendation = (item: Recommendation) => {
    setContent(prev => {
        const newRecommendations = [...prev.recommendations, item];
        return {
            ...prev,
            recommendations: newRecommendations,
            sections: prev.sections.map(s => s.type === 'testimonial' ? { ...s, data: { ...s.data, items: newRecommendations } } : s)
        };
    });
  };

  const updateRecommendation = (id: number, itemData: Partial<Recommendation>) => {
    setContent(prev => {
        const newRecommendations = prev.recommendations.map(item => item.id === id ? { ...item, ...itemData } : item);
        return {
            ...prev,
            recommendations: newRecommendations,
            sections: prev.sections.map(s => s.type === 'testimonial' ? { ...s, data: { ...s.data, items: newRecommendations } } : s)
        };
    });
  };

  const deleteRecommendation = (id: number) => {
    setContent(prev => {
        const newRecommendations = prev.recommendations.filter(item => item.id !== id);
        return {
            ...prev,
            recommendations: newRecommendations,
            sections: prev.sections.map(s => s.type === 'testimonial' ? { ...s, data: { ...s.data, items: newRecommendations } } : s)
        };
    });
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
        updateAbout,
        addValueItem,
        updateValueItem,
        deleteValueItem,
        addGalleryItem, 
        updateGalleryItem, 
        deleteGalleryItem,
        addRecommendation,
        updateRecommendation,
        deleteRecommendation,
        resetContent,
        isAdmin,
        login,
        logout,
        showAdminPanel,
        setShowAdminPanel,
        isEditMode,
        setIsEditMode,
        hasUnsavedChanges,
        publishChanges,
        cancelChanges
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
    