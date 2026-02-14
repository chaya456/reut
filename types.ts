
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

export interface GalleryItem {
  id: number;
  title: string;
  thumbnail: string;
  size: 'large' | 'small' | 'tall';
  images: string[];
  isHidden?: boolean;
}

export interface Recommendation {
  id: number;
  name: string;
  image: string;
  color: string;
  isHidden?: boolean;
}

export interface AppContent {
  hero: HeroContent;
  valueSection: ValueItem[];
  gallery: GalleryItem[];
  recommendations: Recommendation[];
}