
import React, { useState } from 'react';

interface EditableImageProps {
  src: string;
  onUpload: (newUrl: string) => void;
  className?: string;
  alt?: string;
  aspectRatio?: string;
}

const EditableImage: React.FC<EditableImageProps> = ({ 
  src, 
  onUpload, 
  className = '', 
  alt = '',
  aspectRatio = 'aspect-square'
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onUpload(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה, אנא נסי שנית');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative group/img-edit ${aspectRatio} ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img-edit:opacity-100 transition-opacity flex items-center justify-center">
        <label className="cursor-pointer bg-brand-dark/90 hover:bg-brand-dark text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-105 flex items-center gap-2">
          {isUploading ? (
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          )}
          <span>{isUploading ? 'מעלה...' : 'החלף תמונה'}</span>
          <input type="file" className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>
    </div>
  );
};

export default EditableImage;
