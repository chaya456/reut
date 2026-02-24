
import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
      content, updateHero, updateAbout,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      addRecommendation, updateRecommendation, deleteRecommendation,
      addValueItem, updateValueItem, deleteValueItem,
      resetContent, logout
  } = useContent();
  
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'value' | 'gallery' | 'recommendations'>('hero');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Check if Sanity is configured
  const isConfigured = !!import.meta.env.VITE_SANITY_PROJECT_ID;

  if (!isOpen) return null;

  // Cloudinary Upload Helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'client_upload'); 

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dhcscd7il/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      callback(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה, אנא נסה שנית');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans dir-rtl">
      <div className="absolute inset-0 bg-dark-coal/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">מערכת ניהול אתר - רעות</h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${isConfigured ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                    <div className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                    {isConfigured ? 'מחובר ל-Sanity' : 'מצב מקומי (ללא Sanity)'}
                </div>
            </div>
            <div className="flex gap-4">
                <button onClick={() => { if(window.confirm('האם להתנתק מהמערכת?')) logout(); }} className="text-sm bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded transition-colors">יציאה</button>
                <button onClick={resetContent} className="text-sm bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded transition-colors">איפוס נתונים</button>
                <button onClick={onClose} className="text-3xl hover:text-brand-soft leading-none">✕</button>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 shrink-0 overflow-x-auto">
            <button 
                onClick={() => { setActiveTab('hero'); setEditingItem(null); }}
                className={`px-6 py-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'hero' ? 'bg-white text-brand-dark border-t-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                עמוד הבית
            </button>
            <button 
                onClick={() => { setActiveTab('about'); setEditingItem(null); }}
                className={`px-6 py-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'about' ? 'bg-white text-brand-dark border-t-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                אודות
            </button>
             <button 
                onClick={() => { setActiveTab('value'); setEditingItem(null); }}
                className={`px-6 py-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'value' ? 'bg-white text-brand-dark border-t-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                לפני / אחרי
            </button>
            <button 
                onClick={() => { setActiveTab('gallery'); setEditingItem(null); }}
                className={`px-6 py-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'gallery' ? 'bg-white text-brand-dark border-t-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                גלריה
            </button>
            <button 
                onClick={() => { setActiveTab('recommendations'); setEditingItem(null); }}
                className={`px-6 py-4 font-bold transition-colors whitespace-nowrap ${activeTab === 'recommendations' ? 'bg-white text-brand-dark border-t-4 border-brand-dark' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                המלצות
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 text-gray-900">
            
            {/* HERO EDITOR */}
            {activeTab === 'hero' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 text-sm text-blue-800">
                        <strong>הנחיות:</strong> כאן ניתן לערוך את הטקסטים המופיעים בחלק העליון של דף הבית. השינויים נשמרים אוטומטית.
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 border border-gray-200">
                        <h3 className="font-bold text-xl mb-4 border-b pb-2 text-brand-dark">טקסטים ראשיים</h3>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">שורה ראשונה</label>
                            <input type="text" value={content.hero.titleLine1} onChange={e => updateHero({ titleLine1: e.target.value })} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none transition-shadow" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">שורה שניה (מודגש)</label>
                            <input type="text" value={content.hero.titleLine2} onChange={e => updateHero({ titleLine2: e.target.value })} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none transition-shadow" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">שורה שלישית</label>
                            <input type="text" value={content.hero.titleLine3} onChange={e => updateHero({ titleLine3: e.target.value })} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none transition-shadow" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">כותרת משנה</label>
                            <input type="text" value={content.hero.subtitle} onChange={e => updateHero({ subtitle: e.target.value })} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none transition-shadow" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">טקסט כפתור</label>
                            <input type="text" value={content.hero.buttonText} onChange={e => updateHero({ buttonText: e.target.value })} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none transition-shadow" />
                        </div>
                    </div>
                </div>
            )}

            {/* ABOUT EDITOR */}
            {activeTab === 'about' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 text-sm text-blue-800">
                        <strong>הנחיות:</strong> כאן ניתן לערוך את טקסט האודות המופיע באתר.
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4 border border-gray-200">
                        <h3 className="font-bold text-xl mb-4 border-b pb-2 text-brand-dark">טקסט אודות</h3>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">תוכן האודות</label>
                            <textarea 
                                value={content.aboutText} 
                                onChange={e => updateAbout(e.target.value)} 
                                className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none transition-shadow min-h-[200px]" 
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* VALUE SECTION (BEFORE/AFTER) EDITOR */}
            {activeTab === 'value' && (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <span><strong>הנחיות:</strong> הוסף זוגות תמונות של "לפני" ו"אחרי" להצגה בסליידר.</span>
                        <button 
                            onClick={() => setEditingItem({ id: Date.now(), before: '', after: '', isNew: true })}
                            className="bg-brand-dark text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-light hover:text-dark-coal transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span className="text-xl leading-none">+</span> הוספת זוג חדש
                        </button>
                    </div>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-brand-light mb-8 animate-[fadeIn_0.2s] relative">
                            <button onClick={() => setEditingItem(null)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">✕</button>
                            <h3 className="font-bold text-xl mb-6 text-brand-dark border-b pb-2">{editingItem.isNew ? 'הוספת זוג לפני/אחרי חדש' : 'עריכת זוג קיים'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm mb-2 font-bold text-gray-700">תמונת "לפני" (המצב הקודם)</label>
                                    <div className="flex flex-col gap-3">
                                        {editingItem.before ? (
                                            <div className="h-48 bg-white rounded border border-gray-300 overflow-hidden relative group">
                                                <img src={editingItem.before} alt="before" className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-sm">לחץ למטה להחלפה</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                                אין תמונה
                                            </div>
                                        )}
                                        <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, before: base64}))} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-soft file:text-brand-dark hover:file:bg-brand-light" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <label className="block text-sm mb-2 font-bold text-brand-dark">תמונת "אחרי" (התוצאה)</label>
                                    <div className="flex flex-col gap-3">
                                        {editingItem.after ? (
                                            <div className="h-48 bg-white rounded border border-gray-300 overflow-hidden relative group">
                                                <img src={editingItem.after} alt="after" className="w-full h-full object-contain" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-white text-sm">לחץ למטה להחלפה</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                                אין תמונה
                                            </div>
                                        )}
                                        <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, after: base64}))} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-soft file:text-brand-dark hover:file:bg-brand-light" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
                                <button onClick={() => setEditingItem(null)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors">ביטול</button>
                                <button 
                                    disabled={isUploading}
                                    onClick={() => {
                                        if(editingItem.isNew) addValueItem({ ...editingItem, id: Date.now() });
                                        else updateValueItem(editingItem.id, editingItem);
                                        setEditingItem(null);
                                    }}
                                    className="px-8 py-2 bg-brand-dark text-white rounded font-bold hover:bg-brand-light hover:text-dark-coal shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? 'מעלה תמונה...' : 'שמור שינויים'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {content.valueSection.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                                <div className="flex gap-1 h-32 mb-3">
                                    <div className="w-1/2 h-full bg-gray-100 rounded-r overflow-hidden relative">
                                        <span className="absolute top-0 left-0 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-br">לפני</span>
                                        <img src={item.before} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-1/2 h-full bg-gray-100 rounded-l overflow-hidden relative">
                                        <span className="absolute top-0 left-0 bg-brand-dark text-white text-[10px] px-2 py-0.5 rounded-br">אחרי</span>
                                        <img src={item.after} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                                    <button onClick={() => setEditingItem({...item, isNew: false})} className="text-blue-600 hover:text-blue-800 font-bold px-2 py-1 hover:bg-blue-50 rounded transition-colors">עריכה</button>
                                    <button onClick={() => { if(window.confirm('האם למחוק זוג זה?')) deleteValueItem(item.id) }} className="text-red-500 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors">מחיקה</button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* GALLERY EDITOR */}
            {activeTab === 'gallery' && (
                <div className="space-y-6">
                     <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <span><strong>הנחיות:</strong> נהל את הפרויקטים בגלריה. ניתן להוסיף תמונות מרובות לכל פרויקט.</span>
                        <button 
                            onClick={() => setEditingItem({ id: Date.now(), title: '', thumbnail: '', size: 'small', images: [], isHidden: false, isNew: true })}
                            className="bg-brand-dark text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-light hover:text-dark-coal transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span className="text-xl leading-none">+</span> הוספת פרויקט חדש
                        </button>
                    </div>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-brand-light mb-8 animate-[fadeIn_0.2s] relative">
                            <button onClick={() => setEditingItem(null)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">✕</button>
                            <h3 className="font-bold text-xl mb-6 text-brand-dark border-b pb-2">{editingItem.isNew ? 'הוספת פרויקט חדש' : 'עריכת פרויקט'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">שם הפרויקט</label>
                                    <input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none" placeholder="לדוגמה: חריטה על בקבוק יין" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">גודל תצוגה בגלריה</label>
                                    <select value={editingItem.size} onChange={e => setEditingItem({...editingItem, size: e.target.value})} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none">
                                        <option value="small">רגיל (ריבוע 1x1)</option>
                                        <option value="large">גדול (ריבוע 2x2)</option>
                                        <option value="tall">גבוה (מלבן עומד 1x2)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-bold text-gray-700 mb-2">תמונה ראשית (Thumbnail - תוצג בגלריה)</label>
                                <div className="flex gap-4 items-start">
                                    {editingItem.thumbnail ? (
                                        <img src={editingItem.thumbnail} alt="thumb" className="w-24 h-24 object-cover rounded border border-gray-300 shadow-sm" />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center p-1">אין תמונה</div>
                                    )}
                                    <div className="flex-1">
                                        <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, thumbnail: base64}))} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-soft file:text-brand-dark hover:file:bg-brand-light" />
                                        <p className="text-xs text-gray-500 mt-2">מומלץ להעלות תמונה מרובעת או ביחס של 4:5.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">תמונות נוספות (יוצגו בלחיצה על הפרויקט)</label>
                                <div className="space-y-3 mb-4">
                                    {editingItem.images?.map((imgObj: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded border border-gray-200 shadow-sm">
                                            <div className="w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                                                <img src={imgObj.url} className="w-full h-full object-cover" />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="תיאור לתמונה (אופציונלי - יופיע מתחת לתמונה)" 
                                                value={imgObj.description || ''} 
                                                onChange={(e) => {
                                                    const newImages = [...editingItem.images];
                                                    newImages[idx] = { ...newImages[idx], description: e.target.value };
                                                    setEditingItem({...editingItem, images: newImages});
                                                }}
                                                className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:outline-none focus:border-brand-dark"
                                            />
                                            <button 
                                                onClick={() => setEditingItem({...editingItem, images: editingItem.images.filter((_:any, i:number) => i !== idx)})}
                                                className="bg-red-100 text-red-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-200 transition-colors"
                                                title="הסר תמונה"
                                            >✕</button>
                                        </div>
                                    ))}
                                    {(!editingItem.images || editingItem.images.length === 0) && (
                                        <div className="text-center py-4 text-gray-400 bg-gray-50 rounded border border-dashed border-gray-300">
                                            אין תמונות נוספות. הוסף תמונות למטה.
                                        </div>
                                    )}
                                </div>
                                <div className="bg-blue-50 p-3 rounded border border-blue-100 inline-block w-full">
                                    <label className="block text-xs font-bold text-blue-800 mb-1">הוספת תמונות נוספות:</label>
                                    <input type="file" multiple onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, images: [...(editingItem.images || []), { url: base64, description: '' }]}))} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-gray-100">
                                <button onClick={() => setEditingItem(null)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors">ביטול</button>
                                <button 
                                    disabled={isUploading}
                                    onClick={() => {
                                        if(editingItem.isNew) addGalleryItem({ ...editingItem, id: Date.now() });
                                        else updateGalleryItem(editingItem.id, editingItem);
                                        setEditingItem(null);
                                    }}
                                    className="px-8 py-2 bg-brand-dark text-white rounded font-bold hover:bg-brand-light hover:text-dark-coal shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? 'מעלה תמונות...' : 'שמור פרויקט'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.gallery.map(item => (
                            <div key={item.id} className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 relative group ${item.isHidden ? 'opacity-60 bg-gray-50' : ''}`}>
                                <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                    {item.isHidden && (
                                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                            <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">מוסתר</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                        {item.images?.length || 0} תמונות נוספות
                                    </div>
                                </div>
                                <h4 className="font-bold text-lg mb-1 text-gray-900">{item.title}</h4>
                                <p className="text-xs text-gray-500 mb-4">גודל: {item.size === 'small' ? 'רגיל' : item.size === 'large' ? 'גדול' : 'גבוה'}</p>
                                
                                <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingItem({...item, isNew: false})} className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">עריכה</button>
                                        <button onClick={() => updateGalleryItem(item.id, { isHidden: !item.isHidden })} className={`px-3 py-1.5 rounded transition-colors ${item.isHidden ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`}>
                                            {item.isHidden ? 'הצג באתר' : 'הסתר'}
                                        </button>
                                    </div>
                                    <button onClick={() => { if(window.confirm('האם למחוק את הפרויקט לצמיתות?')) deleteGalleryItem(item.id) }} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded transition-colors" title="מחיקה">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* RECOMMENDATIONS EDITOR */}
            {activeTab === 'recommendations' && (
                <div className="space-y-6">
                     <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <span><strong>הנחיות:</strong> הוסף המלצות של לקוחות. מומלץ להשתמש בצילומי מסך מוואטסאפ.</span>
                        <button 
                            onClick={() => setEditingItem({ id: Date.now(), name: '', image: '', color: 'bg-white', isHidden: false, isNew: true })}
                            className="bg-brand-dark text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-light hover:text-dark-coal transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span className="text-xl leading-none">+</span> הוספת המלצה חדשה
                        </button>
                    </div>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-brand-light mb-8 animate-[fadeIn_0.2s] relative">
                            <button onClick={() => setEditingItem(null)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">✕</button>
                            <h3 className="font-bold text-xl mb-6 text-brand-dark border-b pb-2">{editingItem.isNew ? 'הוספת המלצה חדשה' : 'עריכת המלצה'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">שם הממליץ / כותרת</label>
                                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none" placeholder="שם הלקוח" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">צבע רקע לכרטיסייה</label>
                                    <select value={editingItem.color} onChange={e => setEditingItem({...editingItem, color: e.target.value})} className="w-full p-3 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-brand-dark focus:outline-none">
                                        <option value="bg-white">לבן (נקי)</option>
                                        <option value="bg-brand-soft">קרם (מודגש)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-bold text-gray-700 mb-2">תמונת ההמלצה</label>
                                <div className="flex gap-4 items-center">
                                    {editingItem.image ? (
                                        <div className="h-32 w-auto border border-gray-300 rounded bg-white p-1">
                                            <img src={editingItem.image} alt="rec" className="h-full w-auto object-contain" />
                                        </div>
                                    ) : (
                                        <div className="h-32 w-32 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs text-center p-2">אין תמונה</div>
                                    )}
                                    <div className="flex-1">
                                        <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, image: base64}))} className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-soft file:text-brand-dark hover:file:bg-brand-light" />
                                        <p className="text-xs text-gray-500 mt-2">מומלץ להעלות צילום מסך ברור.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-gray-100">
                                <button onClick={() => setEditingItem(null)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors">ביטול</button>
                                <button 
                                    disabled={isUploading}
                                    onClick={() => {
                                        if(editingItem.isNew) addRecommendation({ ...editingItem, id: Date.now() });
                                        else updateRecommendation(editingItem.id, editingItem);
                                        setEditingItem(null);
                                    }}
                                    className="px-8 py-2 bg-brand-dark text-white rounded font-bold hover:bg-brand-light hover:text-dark-coal shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploading ? 'מעלה תמונה...' : 'שמור המלצה'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {content.recommendations.map(item => (
                            <div key={item.id} className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 relative group ${item.isHidden ? 'opacity-60 bg-gray-50' : ''} ${item.color === 'bg-brand-soft' ? 'bg-orange-50/50' : ''}`}>
                                <div className="h-40 bg-gray-50 rounded-lg mb-3 overflow-hidden flex items-center justify-center border border-gray-100 p-2">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain shadow-sm" />
                                </div>
                                <h4 className="font-bold text-center mb-1 text-gray-900 truncate">{item.name}</h4>
                                <div className="flex justify-center gap-2 text-sm mt-3 border-t border-gray-100 pt-3">
                                    <button onClick={() => setEditingItem({...item, isNew: false})} className="text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors">עריכה</button>
                                    <button onClick={() => { if(window.confirm('למחוק את ההמלצה?')) deleteRecommendation(item.id) }} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 pt-6 border-t flex justify-end">
                <button 
                    onClick={onClose} 
                    className="bg-dark-coal text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg"
                >
                    סגירה ושמירת שינויים
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
