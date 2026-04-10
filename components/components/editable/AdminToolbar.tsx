
import React from 'react';
import { useContent } from '../../context/ContentContext';

const AdminToolbar: React.FC = () => {
  const { 
    isEditMode, 
    publishChanges, 
    cancelChanges,
    hasUnsavedChanges
  } = useContent();

  if (!isEditMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100000] flex items-center gap-4 bg-dark-coal/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 animate-[slideUp_0.5s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex flex-col px-4 border-r border-white/10">
        <span className="text-[10px] text-brand-light uppercase tracking-widest font-bold">מצב עריכה פעיל</span>
        <span className="text-white text-xs opacity-60">השינויים נשמרים מקומית עד לפרסום</span>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={cancelChanges}
          className="px-6 py-2 text-white/70 hover:text-white text-sm font-medium transition-colors"
        >
          ביטול
        </button>
        
        <button 
          onClick={publishChanges}
          disabled={!hasUnsavedChanges}
          className={`
            px-8 py-2 rounded-xl font-bold text-sm transition-all shadow-lg
            ${hasUnsavedChanges 
              ? 'bg-brand-dark text-white hover:bg-brand-light hover:text-dark-coal hover:scale-105 active:scale-95' 
              : 'bg-white/10 text-white/30 cursor-not-allowed'}
          `}
        >
          פרסם שינויים
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminToolbar;
