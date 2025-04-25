import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageIcon, DownloadIcon, ShareIcon, ExternalLink } from 'lucide-react';
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
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Create a worker
        const workerScript = `
          self.onmessage = function(e) {
            console.log('Web Worker initialized successfully');
            // Normally here we'd process the image for AVIF compression
            // We're not implementing full AVIF encoding in this demo
            
            // Just sending back confirmation
            self.postMessage({ 
              status: 'success', 
              message: 'AVIF compression simulation completed' 
            });
          }
        `;

        const blob = new Blob([workerScript], { type: 'application/javascript' });
        workerRef.current = new Worker(URL.createObjectURL(blob));
        
        // Setup listener
        workerRef.current.onmessage = (e) => {
          console.log("Worker response:", e.data);
        };
        
        // Initialize the worker
        workerRef.current.postMessage({ action: 'init' });
      } catch (error) {
        console.error("Could not initialize web worker:", error);
      }
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
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
      
      // Store the image URL, save to localStorage and open dialog
      if (imageDataUrl) {
        // Save to localStorage for the dedicated page to access
        localStorage.setItem('currentMeme', imageDataUrl);
        setGeneratedMemeUrl(imageDataUrl);
        setDialogOpen(true);
      }
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
  
  const handleDownloadButtonClick = () => {
    if (generatedMemeUrl) {
      try {
        // Convert data URL to Blob
        const parts = generatedMemeUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        
        // Create Blob and use it to trigger download
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        
        // Method 1: Use File System Access API (newer browsers)
        if ('showSaveFilePicker' in window) {
          (async () => {
            try {
              // @ts-ignore - TS doesn't know about this API yet
              const handle = await window.showSaveFilePicker({
                suggestedName: 'ToolMemeX-creation.png',
                types: [{
                  description: 'PNG Image',
                  accept: {'image/png': ['.png']}
                }]
              });
              const writable = await handle.createWritable();
              await writable.write(blob);
              await writable.close();
              console.log('Saved using File System Access API');
            } catch (err) {
              console.error('File Save Error:', err);
              
              // Fallback to traditional method
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = 'ToolMemeX-creation.png';
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();
              setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
              }, 100);
            }
          })();
        } else {
          // Method 2: Traditional download (older browsers)
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = 'ToolMemeX-creation.png';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        }
      } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please right-click on the image and select "Save Image As..." instead.');
      }
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
                  View & Save Meme
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
            
            {generatedMemeUrl && (
              <div className="bg-[#10101C]/60 p-3 rounded-lg border border-[rgba(255,255,255,0.05)]">
                <p className="text-xs text-gray-400 mb-2">
                  If the button above doesn't work, right-click on the meme preview and select "Open image in new tab" or "Save image as..."
                </p>
              </div>
            )}
            
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
      
      {/* Dialog that shows when saving meme */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#0C0C14] border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-center mb-4 text-[#00C6FF]">Your Meme Is Ready!</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Right-click on the image to save it to your device
            </DialogDescription>
          </DialogHeader>
          
          {generatedMemeUrl && (
            <div className="flex flex-col items-center">
              <div className="rounded-lg overflow-hidden mb-6 w-full max-w-lg mx-auto">
                <a 
                  href={generatedMemeUrl} 
                  download="ToolMemeX-creation.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block cursor-pointer"
                >
                  <img 
                    src={generatedMemeUrl} 
                    alt="Your generated meme" 
                    className="w-full h-auto"
                  />
                  <div className="bg-black/50 backdrop-blur-sm text-white text-sm py-2 text-center">
                    Click to open/download image in new tab
                  </div>
                </a>
              </div>
              
              <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-lg mb-6 text-center">
                <p className="mb-2 font-medium">To save your meme:</p>
                <p className="text-sm text-gray-300">Right-click (or press and hold) on the image above and select "Save Image As..."</p>
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                <div className="flex gap-3">
                  <div className="w-full text-center p-3 bg-[#0f172a] rounded-lg">
                    <p className="text-gray-300 text-sm">
                      To save your meme, tap and hold (or right-click) on the image above and select "Download Image" or "Save Image"
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a 
                    href={generatedMemeUrl || '#'}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button 
                      className="w-full bg-[#1E293B] hover:bg-[#334155] text-white"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </a>
                  
                  <div className="flex-1">
                    <Button 
                      className="w-full bg-[#1E293B] hover:bg-[#334155] text-white"
                      onClick={async () => {
                        if (!generatedMemeUrl) return;
                        
                        try {
                          // Create a blob from the image data
                          const response = await fetch(generatedMemeUrl);
                          const blob = await response.blob();
                          
                          // Create a download link
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.style.display = 'none';
                          a.href = url;
                          a.download = 'ToolMemeX-creation.png';
                          
                          // Add to document, click, and clean up
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (error) {
                          console.error('Error downloading image:', error);
                          onFallbackMessage();
                        }
                      }}
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download Image
                    </Button>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="w-full bg-transparent"
                >
                  Return to Editor
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemePreview;