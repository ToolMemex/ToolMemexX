import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, DownloadIcon, ShareIcon } from 'lucide-react';
import { MemeState } from '../pages/Home';

interface MemePreviewProps {
  memeState: MemeState;
  setMemeState: React.Dispatch<React.SetStateAction<MemeState>>;
  onShareClick: () => void;
  onFallbackMessage: () => void;
}

const MemePreview: React.FC<MemePreviewProps> = ({ 
  memeState, 
  setMemeState, 
  onShareClick, 
  onFallbackMessage 
}) => {
  const [, setLocation] = useLocation();
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Create a worker
        const workerScript = `
          self.onmessage = function(e) {
            // In a real implementation, this would convert the image to AVIF format
            // For this demo, we'll just send back the original image data
            setTimeout(() => {
              self.postMessage({
                status: 'success',
                imageData: e.data.imageData
              });
            }, 500);
          };
        `;
        
        const workerBlob = new Blob([workerScript], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(workerBlob);
        workerRef.current = new Worker(workerUrl);
        
        console.log('Web Worker initialized successfully');
      } catch (error) {
        console.error('Web Worker initialization failed:', error);
        // Set worker to null to ensure fallback is used
        workerRef.current = null;
      }
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);
  
  const handleFontChange = (value: string) => {
    setMemeState({ ...memeState, captionFont: value });
  };
  
  const handleColorChange = (value: string) => {
    setMemeState({ ...memeState, captionColor: value });
  };
  
  const downloadMeme = () => {
    if (!memeState.uploadedImage || !memeState.selectedCaption) return;
    
    console.log('Starting meme download process');
    
    // Create a canvas to render the meme
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    const img = new Image();
    
    img.onload = function() {
      console.log('Image loaded successfully');
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Draw caption background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
      
      // Draw caption text
      ctx.fillStyle = 
        memeState.captionColor === 'yellow' ? '#FBBF24' : 
        memeState.captionColor === 'neon' ? '#00C6FF' : '#FFFFFF';
      
      ctx.font = 
        memeState.captionFont === 'impact' ? 'bold 28px Impact, sans-serif' : 
        memeState.captionFont === 'comic' ? '28px Comic Sans MS, cursive' : 
        '28px Arial, sans-serif';
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw the caption
      ctx.fillText(`"${memeState.selectedCaption}"`, canvas.width / 2, canvas.height - 40, canvas.width - 20);
      
      // Add a small watermark
      ctx.font = '12px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('ToolMemeX', canvas.width - 50, canvas.height - 10);
      
      // Get the final image data
      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Navigate to download page with image data
      const encodedImageData = encodeURIComponent(imageDataUrl);
      const encodedCaption = encodeURIComponent(memeState.selectedCaption);
      
      // IMPORTANT: Use the new download page approach
      setLocation(`/download?image=${encodedImageData}&caption=${encodedCaption}`);
    };
    
    img.onerror = function(error) {
      console.error('Failed to load image:', error);
      onFallbackMessage();
    };
    
    img.src = memeState.uploadedImage;
  };
  
  // Get the font and color class based on the selection
  const getFontClass = () => {
    switch(memeState.captionFont) {
      case 'impact': 
        return 'font-bold uppercase tracking-wider';
      case 'comic':
        return 'font-medium';
      default:
        return 'font-sans';
    }
  };
  
  const getColorClass = () => {
    switch(memeState.captionColor) {
      case 'yellow':
        return 'text-yellow-300';
      case 'neon':
        return 'text-[#00C6FF]';
      default:
        return 'text-white';
    }
  };
  
  return (
    <>
      {(!memeState.uploadedImage || !memeState.selectedCaption) ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-4 animate-float">
            <ImageIcon className="h-10 w-10 text-[#00C6FF] opacity-70" />
          </div>
          <p className="text-gray-400 text-center">
            Your meme preview will appear here<br />after generating captions
          </p>
        </div>
      ) : (
        <div>
          <div className="relative glass rounded-xl overflow-hidden">
            <img 
              className="w-full h-auto"
              src={memeState.uploadedImage}
              alt="Meme preview"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0C0C14]/80 backdrop-blur-sm">
              <p className={`text-lg text-center font-medium ${getFontClass()} ${getColorClass()}`}>
                "{memeState.selectedCaption}"
              </p>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Button 
                  onClick={downloadMeme}
                  className="w-full btn-glow py-3 rounded-xl font-heading flex items-center justify-center"
                >
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  Download Meme
                </Button>
              </div>
              <div className="w-full sm:w-1/2">
                <Button 
                  onClick={onShareClick}
                  variant="outline" 
                  className="w-full py-3 rounded-xl font-heading bg-[#10101C] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-all flex items-center justify-center"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="glass rounded-lg p-4">
              <h4 className="font-heading text-sm uppercase text-gray-400 mb-2">Caption Styling</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Font</Label>
                  <Select onValueChange={handleFontChange} value={memeState.captionFont}>
                    <SelectTrigger className="w-full bg-[#0C0C14] border border-[rgba(255,255,255,0.05)] rounded-lg">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impact">Impact</SelectItem>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="comic">Comic Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm text-gray-400 mb-1">Color</Label>
                  <Select onValueChange={handleColorChange} value={memeState.captionColor}>
                    <SelectTrigger className="w-full bg-[#0C0C14] border border-[rgba(255,255,255,0.05)] rounded-lg">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="neon">Neon Blue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemePreview;