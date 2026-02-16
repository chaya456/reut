
import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { 
      content, updateHero,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      addRecommendation, updateRecommendation, deleteRecommendation,
      addValueItem, updateValueItem, deleteValueItem,
      resetContent 
  } = useContent();
  
  const [activeTab, setActiveTab] = useState<'hero' | 'value' | 'gallery' | 'recommendations'>('hero');
  const [editingItem, setEditingItem] = useState<any>(null);

  if (!isOpen) return null;

  // Image Upload Helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans dir-rtl">
      <div className="absolute inset-0 bg-dark-coal/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold">מערכת ניהול אתר - רעות</h2>
            <div className="flex gap-4">
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
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            
            {/* HERO EDITOR */}
            {activeTab === 'hero' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                        <h3 className="font-bold text-xl mb-4 border-b pb-2">טקסטים ראשיים</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">שורה ראשונה</label>
                            <input type="text" value={content.hero.titleLine1} onChange={e => updateHero({ titleLine1: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-dark focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">שורה שניה (מודגש)</label>
                            <input type="text" value={content.hero.titleLine2} onChange={e => updateHero({ titleLine2: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-dark focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">שורה שלישית</label>
                            <input type="text" value={content.hero.titleLine3} onChange={e => updateHero({ titleLine3: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-dark focus:outline-none" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">כותרת משנה</label>
                            <input type="text" value={content.hero.subtitle} onChange={e => updateHero({ subtitle: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-dark focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">טקסט כפתור</label>
                            <input type="text" value={content.hero.buttonText} onChange={e => updateHero({ buttonText: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-brand-dark focus:outline-none" />
                        </div>
                    </div>
                </div>
            )}

            {/* VALUE SECTION (BEFORE/AFTER) EDITOR */}
            {activeTab === 'value' && (
                 <div className="space-y-6">
                    <button 
                        onClick={() => setEditingItem({ id: Date.now(), before: '', after: '', isNew: true })}
                        className="bg-brand-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-light hover:text-dark-coal transition-colors shadow-md"
                    >
                        + הוספת זוג חדש
                    </button>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-brand-light mb-8 animate-[fadeIn_0.2s]">
                            <h3 className="font-bold text-lg mb-4">{editingItem.isNew ? 'זוג לפני/אחרי חדש' : 'עריכת זוג'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                                <div>
                                    <label className="block text-sm mb-1 font-bold text-gray-700">תמונת לפני (ללא הדמיה)</label>
                                    <div className="flex flex-col gap-2">
                                        {editingItem.before && (
                                            <div className="h-40 bg-gray-100 rounded border overflow-hidden">
                                                <img src={editingItem.before} alt="before" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, before: base64}))} className="text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 font-bold text-brand-dark">תמונת אחרי (עם ערך)</label>
                                    <div className="flex flex-col gap-2">
                                        {editingItem.after && (
                                            <div className="h-40 bg-gray-100 rounded border overflow-hidden">
                                                <img src={editingItem.after} alt="after" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, after: base64}))} className="text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">ביטול</button>
                                <button 
                                    onClick={() => {
                                        if(editingItem.isNew) addValueItem({ ...editingItem, id: Date.now() });
                                        else updateValueItem(editingItem.id, editingItem);
                                        setEditingItem(null);
                                    }}
                                    className="px-6 py-2 bg-brand-dark text-white rounded font-bold hover:opacity-90"
                                >
                                    שמירה
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {content.valueSection.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow relative">
                                <div className="flex gap-1 h-32 mb-2">
                                    <div className="w-1/2 h-full bg-gray-100 rounded overflow-hidden relative">
                                        <span className="absolute top-0 left-0 bg-black/50 text-white text-[10px] px-1">לפני</span>
                                        <img src={item.before} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-1/2 h-full bg-gray-100 rounded overflow-hidden relative">
                                        <span className="absolute top-0 left-0 bg-brand-dark text-white text-[10px] px-1">אחרי</span>
                                        <img src={item.after} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2 border-t">
                                    <button onClick={() => setEditingItem({...item, isNew: false})} className="text-blue-600 hover:underline font-bold">עריכה</button>
                                    <button onClick={() => { if(confirm('למחוק?')) deleteValueItem(item.id) }} className="text-red-500 hover:text-red-700">מחיקה</button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* GALLERY EDITOR */}
            {activeTab === 'gallery' && (
                <div className="space-y-6">
                     <button 
                        onClick={() => setEditingItem({ id: Date.now(), title: '', thumbnail: '', size: 'small', images: [], isHidden: false, isNew: true })}
                        className="bg-brand-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-light hover:text-dark-coal transition-colors shadow-md"
                    >
                        + הוספת פרויקט חדש
                    </button>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-brand-light mb-8 animate-[fadeIn_0.2s]">
                            <h3 className="font-bold text-lg mb-4">{editingItem.isNew ? 'פרויקט חדש' : 'עריכת פרויקט'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm mb-1">שם הפרויקט</label>
                                    <input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">גודל תצוגה</label>
                                    <select value={editingItem.size} onChange={e => setEditingItem({...editingItem, size: e.target.value})} className="w-full p-2 border rounded">
                                        <option value="small">רגיל (ריבוע)</option>
                                        <option value="large">גדול (תופס 4 משבצות)</option>
                                        <option value="tall">גבוה (מלבן עומד)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm mb-1">תמונה ראשית (Thumbnail)</label>
                                <div className="flex gap-4 items-center">
                                    {editingItem.thumbnail && <img src={editingItem.thumbnail} alt="thumb" className="w-16 h-16 object-cover rounded border" />}
                                    <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, thumbnail: base64}))} className="text-sm" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">תמונות נוספות לגלריה (לחץ להוספה)</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editingItem.images?.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group w-20 h-20">
                                            <img src={img} className="w-full h-full object-cover rounded border" />
                                            <button 
                                                onClick={() => setEditingItem({...editingItem, images: editingItem.images.filter((_:any, i:number) => i !== idx)})}
                                                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                                <input type="file" multiple onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, images: [...(editingItem.images || []), base64]}))} className="text-sm" />
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">ביטול</button>
                                <button 
                                    onClick={() => {
                                        if(editingItem.isNew) addGalleryItem({ ...editingItem, id: Date.now() });
                                        else updateGalleryItem(editingItem.id, editingItem);
                                        setEditingItem(null);
                                    }}
                                    className="px-6 py-2 bg-brand-dark text-white rounded font-bold hover:opacity-90"
                                >
                                    שמירה
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {content.gallery.map(item => (
                            <div key={item.id} className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow relative ${item.isHidden ? 'opacity-50' : ''}`}>
                                <div className="h-40 bg-gray-100 rounded mb-3 overflow-hidden">
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="space-x-2 space-x-reverse">
                                        <button onClick={() => setEditingItem({...item, isNew: false})} className="text-blue-600 hover:underline font-bold">עריכה</button>
                                        <button onClick={() => updateGalleryItem(item.id, { isHidden: !item.isHidden })} className="text-orange-600 hover:underline">{item.isHidden ? 'הצג' : 'הסתר'}</button>
                                    </div>
                                    <button onClick={() => { if(confirm('למחוק?')) deleteGalleryItem(item.id) }} className="text-red-500 hover:text-red-700">מחיקה</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* RECOMMENDATIONS EDITOR */}
            {activeTab === 'recommendations' && (
                <div className="space-y-6">
                     <button 
                        onClick={() => setEditingItem({ id: Date.now(), name: '', image: '', color: 'bg-white', isHidden: false, isNew: true })}
                        className="bg-brand-dark text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-light hover:text-dark-coal transition-colors shadow-md"
                    >
                        + הוספת המלצה חדשה
                    </button>

                    {editingItem && (
                        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-brand-light mb-8 animate-[fadeIn_0.2s]">
                            <h3 className="font-bold text-lg mb-4">{editingItem.isNew ? 'המלצה חדשה' : 'עריכת המלצה'}</h3>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm mb-1">שם הממליץ</label>
                                    <input type="text" value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">צבע רקע</label>
                                    <select value={editingItem.color} onChange={e => setEditingItem({...editingItem, color: e.target.value})} className="w-full p-2 border rounded">
                                        <option value="bg-white">לבן</option>
                                        <option value="bg-brand-soft">קרם (Brand Soft)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm mb-1">תמונת המלצה (צילום מסך מוואטסאפ וכד')</label>
                                <div className="flex gap-4 items-center">
                                    {editingItem.image && <img src={editingItem.image} alt="rec" className="w-auto h-20 object-contain rounded border" />}
                                    <input type="file" onChange={(e) => handleImageUpload(e, (base64) => setEditingItem({...editingItem, image: base64}))} className="text-sm" />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">ביטול</button>
                                <button 
                                    onClick={() => {
                                        if(editingItem.isNew) addRecommendation({ ...editingItem, id: Date.now() });
                                        else updateRecommendation(editingItem.id, editingItem);
                                        setEditingItem(null);
                                    }}
                                    className="px-6 py-2 bg-brand-dark text-white rounded font-bold hover:opacity-90"
                                >
                                    שמירה
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {content.recommendations.map(item => (
                            <div key={item.id} className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow relative ${item.isHidden ? 'opacity-50' : ''} ${item.color === 'bg-brand-soft' ? 'bg-orange-50' : ''}`}>
                                <div className="h-32 bg-gray-50 rounded mb-3 overflow-hidden flex items-center justify-center border">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <h4 className="font-bold text-center mb-2">{item.name}</h4>
                                <div className="flex justify-center gap-4 text-sm mt-2 border-t pt-2">
                                    <button onClick={() => setEditingItem({...item, isNew: false})} className="text-blue-600 hover:underline font-bold">עריכה</button>
                                    <button onClick={() => { if(confirm('למחוק?')) deleteRecommendation(item.id) }} className="text-red-500 hover:text-red-700">מחיקה</button>
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
