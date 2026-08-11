
export interface HeroContent {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  buttonText: string;
}

export interface ValueItem {
  id: number;
  before: string;
  after: string;
}

export interface GalleryImage {
  url: string;
  description?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  thumbnail: string;
  size: 'large' | 'small' | 'tall';
  images: GalleryImage[];
  isHidden?: boolean;
}

export interface Recommendation {
  id: number;
  name: string;
  image: string;
  color: string;
  isHidden?: boolean;
}

export type SectionType = 'hero' | 'gallery' | 'comparison' | 'testimonial' | 'about' | 'process';

export interface BaseSection {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  data: HeroContent;
}

export interface ComparisonSection extends BaseSection {
  type: 'comparison';
  data: {
    items: ValueItem[];
    text?: string;
  };
}

export interface GallerySection extends BaseSection {
  type: 'gallery';
  data: {
    items: GalleryItem[];
    note?: string;
  };
}

export interface TestimonialSection extends BaseSection {
  type: 'testimonial';
  data: {
    items: Recommendation[];
  };
}

export interface AboutSection extends BaseSection {
  type: 'about';
  data: {
    text: string;
    steps: ProcessStep[];
    summary: string;
  };
}

export interface ProcessStep {
  text: string;
  isLink?: boolean;
}

export type Section = HeroSection | ComparisonSection | GallerySection | TestimonialSection | AboutSection;

export interface PricingMaterial {
  id: string;
  name: string;
  method: 'xtool' | 'cricut';
  first: number;   // מילה ראשונה + אלמנט מתנה
  upTo5: number;   // עד 5 מילים / לוגו וקטורי
  extra: number;   // כל מילה נוספת (מהמילה השישית)
  large: number;   // כתב גדול - מחיר למילה
  customQuote?: boolean; // חומר ללא מחיר קבוע - מציג "צרו קשר להצעת מחיר מותאמת אישית"
}

export interface PricingData {
  materials: PricingMaterial[];
  image6: number;        // חריטת תמונה / דמות עד 6 ס"מ
  image10: number;       // חריטת תמונה / דמות עד 10 ס"מ
  keyboard: number;      // חריטת מקלדת
  hourlyRate: number;    // עיצוב מיוחד - מחיר לשעה
  bulkThreshold: number; // מעל כמות זו = הצעה מותאמת אישית
}

// כל הטקסטים (מלל) של מחשבון התמחור - ניתנים לעריכה מלוח הבקרה (טאב "מחשבון").
export interface CalculatorTexts {
  backLink: string;
  title: string;
  subtitle: string;
  methodLabel: string;
  methodEngrave: string;
  methodCut: string;
  typeLabel: string;
  typeText: string;
  typeImage: string;
  typeKeyboard: string;
  materialLabel: string;
  designLabel: string;
  pkgFirstTitle: string;
  pkgFirstDesc: string;
  pkgUpTo5Title: string;
  pkgUpTo5Desc: string;
  pkgLargeTitle: string;
  pkgLargeDesc: string;
  wordsLabel: string;
  wordsHint: string;
  imageSizeLabel: string;
  imageSize6: string;
  imageSize10: string;
  keyboardNote: string;
  quantityLabel: string;
  resultLabel: string;
  customQuoteTitle: string;
  customQuoteDesc: string;
  customQuoteButton: string;
  bulkResultTitle: string;
  bulkResultDesc: string;
  bulkTitle: string;
  bulkDesc: string;
  bulkButton: string;
  note1: string;
  note2: string;
  note3: string;
  note4: string;
  note5: string;
}

// חלונית "ניוז" קופצת בכניסה לאתר. כל השדות ניתנים לעריכה מלוח הבקרה (טאב "חלונית קופצת")
// ונשמרים ל-Sanity יחד עם שאר התוכן. רעות מדליקה/מכבה אותה ומעדכנת תמונה+טקסט בכל פעם.
export interface NewsPopupContent {
  enabled: boolean;    // האם להציג את החלונית באתר
  image: string;       // כתובת התמונה
  title: string;       // כותרת
  text: string;        // טקסט הגוף (תומך במעברי שורה)
  buttonText: string;  // טקסט הכפתור ליצירת קשר. ריק = ללא כפתור
}

export interface AppContent {
  hero: HeroContent;
  valueSection: ValueItem[];
  aboutText: string;
  gallery: GalleryItem[];
  recommendations: Recommendation[];
  sections: Section[];
  pricing?: PricingData;
  calculator?: CalculatorTexts;
  newsPopup?: NewsPopupContent;
}
