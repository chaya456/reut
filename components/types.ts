
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

export interface AppContent {
  hero: HeroContent;
  valueSection: ValueItem[];
  aboutText: string;
  gallery: GalleryItem[];
  recommendations: Recommendation[];
  sections: Section[];
}
