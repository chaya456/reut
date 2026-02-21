import React, { useState } from 'react';

const ImageUploader: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLoading(true);

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

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImage(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('שגיאה בהעלאת התמונה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border-2 border-dashed border-brand-light/50 rounded-xl bg-white/50 backdrop-blur-sm max-w-md mx-auto my-8 text-center transition-all hover:border-brand-dark/50">
      <h3 className="text-xl font-bold mb-4 text-dark-coal">העלאת תמונה לקלאודינרי</h3>
      
      <div className="relative group">
        <input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-brand-light/30 rounded-lg bg-white/80 group-hover:bg-white transition-colors">
            <svg className="w-10 h-10 text-brand-dark mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-sm text-dark-coal/70 font-medium">לחצי לבחירת קובץ</span>
        </div>
      </div>

      {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-brand-dark font-medium">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>מעלה תמונה...</span>
          </div>
      )}

      {image && (
        <div className="mt-6 animate-[fadeIn_0.5s_ease-out]">
          <p className="mb-2 text-sm text-green-600 font-bold">התמונה הועלתה בהצלחה!</p>
          <div className="rounded-lg overflow-hidden shadow-lg border border-white/50">
              <img src={image} alt="Uploaded" className="w-full h-auto object-cover" />
          </div>
          <p className="mt-2 text-xs text-dark-coal/50 break-all dir-ltr select-all">{image}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
