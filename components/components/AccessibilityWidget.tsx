import React, { useState, useEffect } from 'react';

const AccessibilityWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [settings, setSettings] = useState({
    fontSize: 100, // percentage
    grayscale: false,
    highContrast: false,
    highlightLinks: false,
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font Size (Affects rem units)
    root.style.fontSize = `${settings.fontSize}%`;

    // Grayscale & Contrast
    let filterString = '';
    if (settings.grayscale) filterString += 'grayscale(100%) ';
    if (settings.highContrast) filterString += 'contrast(125%) ';
    body.style.filter = filterString;

    // Highlight Links logic
    if (settings.highlightLinks) {
        body.classList.add('access-highlight-links');
    } else {
        body.classList.remove('access-highlight-links');
    }

  }, [settings]);

  // Inject styles for link highlighting
  useEffect(() => {
      const styleId = 'accessibility-styles';
      if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.innerHTML = `
            .access-highlight-links a, 
            .access-highlight-links button {
                text-decoration: underline !important;
                font-weight: bold !important;
                box-shadow: 0 0 0 2px #FF9666 !important;
            }
          `;
          document.head.appendChild(style);
      }
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  const updateSetting = (key: keyof typeof settings, value: any) => {
      setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
      setSettings({
          fontSize: 100,
          grayscale: false,
          highContrast: false,
          highlightLinks: false
      });
  };

  return (
      <div className="fixed bottom-4 left-4 z-[9999] font-sans dir-rtl">
        
        {/* Panel Container */}
        <div 
            className={`
                absolute bottom-16 left-0 
                w-72 bg-white/95 backdrop-blur-xl 
                shadow-[0_10px_40px_rgba(0,0,0,0.1)] 
                rounded-2xl overflow-hidden 
                transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-left border border-brand-light/40
                ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-90 translate-y-4 invisible pointer-events-none'}
            `}
        >
            {/* Header */}
            <div className="bg-brand-soft/80 p-4 border-b border-brand-light/30 flex justify-between items-center">
                <div className="flex items-center gap-2 text-dark-coal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h3 className="font-bold text-base">כלי נגישות</h3>
                </div>
                <button 
                    onClick={resetSettings} 
                    className="text-xs font-medium text-brand-dark hover:bg-brand-dark/10 px-2 py-1 rounded transition-colors"
                >
                    איפוס הגדרות
                </button>
            </div>

            {/* Controls */}
            <div className="p-5 space-y-4">
                
                {/* Font Size Control */}
                <div className="space-y-2">
                    <span className="text-sm font-medium text-dark-coal/80 block">גודל טקסט</span>
                    <div className="flex items-center justify-between bg-brand-soft/50 rounded-lg p-1 border border-brand-light/20">
                        <button 
                            onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))} 
                            className="w-10 h-10 flex items-center justify-center text-dark-coal hover:bg-white rounded-md transition-all active:scale-95"
                            aria-label="הקטן טקסט"
                        >
                            A-
                        </button>
                        <span className="text-xs font-mono opacity-60">{settings.fontSize}%</span>
                        <button 
                            onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))} 
                            className="w-10 h-10 flex items-center justify-center text-dark-coal hover:bg-white rounded-md transition-all active:scale-95 font-bold"
                            aria-label="הגדל טקסט"
                        >
                            A+
                        </button>
                    </div>
                </div>

                {/* Toggles Grid */}
                <div className="grid grid-cols-1 gap-2">
                    
                    <button 
                        onClick={() => updateSetting('grayscale', !settings.grayscale)} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${settings.grayscale ? 'bg-dark-coal text-white border-dark-coal' : 'bg-white hover:bg-brand-soft border-brand-light/20 text-dark-coal'}`}
                    >
                        <span className="text-sm font-medium flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>
                            גווני אפור
                        </span>
                        <div className={`w-3 h-3 rounded-full border ${settings.grayscale ? 'bg-brand-light border-transparent' : 'border-current opacity-30'}`}></div>
                    </button>

                    <button 
                        onClick={() => updateSetting('highContrast', !settings.highContrast)} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${settings.highContrast ? 'bg-dark-coal text-white border-dark-coal' : 'bg-white hover:bg-brand-soft border-brand-light/20 text-dark-coal'}`}
                    >
                        <span className="text-sm font-medium flex items-center gap-2">
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                            ניגודיות חדה
                        </span>
                        <div className={`w-3 h-3 rounded-full border ${settings.highContrast ? 'bg-brand-light border-transparent' : 'border-current opacity-30'}`}></div>
                    </button>

                    <button 
                        onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)} 
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${settings.highlightLinks ? 'bg-dark-coal text-white border-dark-coal' : 'bg-white hover:bg-brand-soft border-brand-light/20 text-dark-coal'}`}
                    >
                        <span className="text-sm font-medium flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            הדגשת קישורים
                        </span>
                        <div className={`w-3 h-3 rounded-full border ${settings.highlightLinks ? 'bg-brand-light border-transparent' : 'border-current opacity-30'}`}></div>
                    </button>

                </div>
            </div>
        </div>

        {/* Main Floating Button */}
        <button 
            onClick={toggleOpen}
            className={`
                relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center 
                transition-all duration-500 ease-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-brand-light/50
                ${isOpen ? 'bg-dark-coal text-white' : 'bg-brand-light text-dark-coal hover:bg-brand-dark hover:text-white'}
            `}
            aria-label="תפריט נגישות"
            aria-expanded={isOpen}
        >
            {/* Standard Accessibility Icon (Legal Requirement) */}
            <div className={`absolute transition-all duration-300 w-8 h-8 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="7.5" r="1.5" />
                    <path d="M9 10.5h6v1.5h-1.5v5h-3v-5H9v-1.5z" />
                </svg>
            </div>

            {/* X Icon (Open State) */}
            <div className={`absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-50'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
        </button>
      </div>
  );
};

export default AccessibilityWidget;