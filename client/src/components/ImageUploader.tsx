import { FC, useState, useRef } from "react";
import { ImageIcon, X } from "lucide-react";
import type { MemeState } from "@/pages/Home";

interface ImageUploaderProps {
  memeState: MemeState;
  setMemeState: React.Dispatch<React.SetStateAction<MemeState>>;
}

const ImageUploader: FC<ImageUploaderProps> = ({ memeState, setMemeState }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.match('image.*')) {
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMemeState({
            ...memeState,
            uploadedImage: e.target.result.toString()
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.match('image.*')) {
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMemeState({
            ...memeState,
            uploadedImage: e.target.result.toString()
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setMemeState({
      ...memeState,
      uploadedImage: null,
      selectedCaption: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {!memeState.uploadedImage ? (
        <div 
          className={`upload-zone border-2 border-dashed ${isDragging ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'} rounded-xl p-8 mb-6 text-center cursor-pointer flex flex-col items-center justify-center transition-all hover:border-[#00C6FF]`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-[#10101C] flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-[#00C6FF]" />
          </div>
          <p className="text-gray-300 mb-2">Drag & drop your image or click to browse</p>
          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
          <input 
            type="file" 
            ref={fileInputRef}
            id="imageInput" 
            accept="image/*" 
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="mb-6 relative">
          <img 
            className="w-full h-auto rounded-xl object-cover"
            src={memeState.uploadedImage}
            alt="Uploaded meme image"
          />
          <button 
            className="absolute top-3 right-3 bg-[#0C0C14]/80 text-white p-2 rounded-full hover:bg-red-500/80 transition-all"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
