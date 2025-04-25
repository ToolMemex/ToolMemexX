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
  
  const viewMeme = () => {
    if (!memeState.uploadedImage || !memeState.selectedCaption) return;
    
    console.log('Preparing meme preview');
    
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
      
      // Get color based on selection
      let textColor = '#FFFFFF'; // Default white
      switch(memeState.captionColor) {
        case 'yellow': textColor = '#FBBF24'; break;
        case 'neon': textColor = '#00C6FF'; break;
        case 'green': textColor = '#4ADE80'; break;
        case 'pink': textColor = '#F472B6'; break;
        case 'purple': textColor = '#A78BFA'; break;
        case 'orange': textColor = '#FB923C'; break;
      }
      
      // Set text color
      ctx.fillStyle = textColor;
      
      // Get font based on selection
      let fontFamily = '28px Arial, sans-serif'; // Default
      if (memeState.captionFont === 'impact') {
        fontFamily = 'bold 28px Impact, sans-serif';
      } else if (memeState.captionFont === 'comic') {
        fontFamily = '28px Comic Sans MS, cursive';
      }
      
      // Set font
      ctx.font = fontFamily;
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
      
      // Open the dialog with the generated meme
      if (imageDataUrl) {
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
      case 'green':
        return 'text-green-400';
      case 'pink':
        return 'text-pink-400';
      case 'purple':
        return 'text-purple-400';
      case 'orange':
        return 'text-orange-400';
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
                  onClick={viewMeme}
                  className="w-full btn-glow py-3 rounded-xl font-heading flex items-center justify-center"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  View Full Meme
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
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Dialog that shows full meme with saving instructions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#0C0C14] border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-center mb-4 text-[#00C6FF]">Your Meme Is Ready!</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Right-click on the image to save it to your device or take a screenshot
            </DialogDescription>
          </DialogHeader>
          
          {generatedMemeUrl && (
            <div className="flex flex-col items-center">
              <div className="rounded-lg overflow-hidden mb-4 w-full max-w-lg mx-auto border-2 border-[#0f172a]">
                <img 
                  src={generatedMemeUrl} 
                  alt="Your generated meme" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-lg mb-4 text-center w-full">
                <p className="mb-2 font-medium text-[#00C6FF]">Save Options:</p>
                <div className="space-y-2 text-left">
                  <p className="text-sm text-gray-300">
                    <span className="inline-block w-6 text-center">1.</span> 
                    <strong>Right-click</strong> on the image and select <strong>"Save Image As..."</strong>
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="inline-block w-6 text-center">2.</span>
                    <strong>Screenshot</strong> the image (use your device's screenshot tool)
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="inline-block w-6 text-center">3.</span>
                    <strong>Open in new tab</strong> and save from there
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a 
                  href={generatedMemeUrl || '#'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    className="w-full bg-[#1E293B] hover:bg-[#334155] text-white h-full flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </a>
                
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="w-full bg-transparent border-[#00C6FF] text-[#00C6FF] hover:bg-[#00C6FF]/10"
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