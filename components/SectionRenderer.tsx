import React, { useState } from 'react';
import { Section } from '../types';
import Hero from './Hero';
import ValueSection from './ValueSection';
import Gallery from './Gallery';
import Recommendations from './Recommendations';
import AboutSection from './AboutSection';
import ImageUploader from './ImageUploader';

interface SectionRendererProps {
  section: Section;
  isAdmin?: boolean;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, isAdmin }) => {
  const [showUploader, setShowUploader] = useState(false);

  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return <Hero data={section.data} />;
      case 'comparison':
        return <ValueSection id={section.id} data={section.data} title={section.title} subtitle={section.subtitle} />;
      case 'about':
        return <AboutSection id={section.id} title={section.title || ''} text={section.data.text} steps={section.data.steps} summary={section.data.summary} />;
      case 'gallery':
        return <Gallery id={section.id} data={section.data} title={section.title} subtitle={section.subtitle} />;
      case 'testimonial':
        return <Recommendations id={section.id} data={section.data} title={section.title} subtitle={section.subtitle} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Admin / Upload Control - Only visible in Admin Mode */}
      {isAdmin && (
        <div className="absolute top-4 left-4 z-50">
          <button 
              onClick={() => setShowUploader(!showUploader)}
              className="bg-brand-dark text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl hover:bg-black transition-all transform hover:scale-105 flex items-center gap-2"
          >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {showUploader ? 'סגור פאנל ניהול' : `ניהול ${section.type}`}
          </button>
        </div>
      )}

      {/* Uploader Panel */}
      {isAdmin && showUploader && (
          <div className="relative z-50 bg-white/95 backdrop-blur-md p-6 border-b-2 border-brand-dark shadow-2xl animate-in slide-in-from-top duration-300">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold mb-1 text-brand-dark">ניהול תוכן: {section.title || section.id}</h3>
                <p className="text-sm text-gray-500 mb-4">כאן ניתן להעלות תמונות חדשות לקטגוריה זו</p>
                <ImageUploader />
              </div>
          </div>
      )}

      {renderContent()}
    </div>
  );
};

export default SectionRenderer;
