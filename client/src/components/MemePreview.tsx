import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, DownloadIcon, ShareIcon, ExternalLink, MoonIcon, SunIcon, SaveIcon, HistoryIcon } from 'lucide-react';
import { MemeState } from '../pages/Home';
import MemeStylePresets from './MemeStylePresets';

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
    if (!memeState.uploadedImage || (!memeState.selectedCaption && !memeState.useCustomCaption)) return;
    
    // Preparing meme preview
    
    // Create a canvas to render the meme
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    const img = new Image();
    
    img.onload = function() {
      // Image loaded successfully
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Determine caption position and background
      let bgY = 0;
      let textY = 0;
      
      // Position is based on user's selection
      if (memeState.captionPosition === 'top') {
        bgY = 0;
        textY = 40;
      } else if (memeState.captionPosition === 'center') {
        bgY = (canvas.height / 2) - 40;
        textY = canvas.height / 2;
      } else { // bottom (default)
        bgY = canvas.height - 80;
        textY = canvas.height - 40;
      }
      
      // Draw caption background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, bgY, canvas.width, 80);
      
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
      
      // Get font type based on selection
      let fontFamily;
      if (memeState.captionFont === 'impact') {
        fontFamily = `bold ${memeState.captionSize}px Impact, sans-serif`;
      } else if (memeState.captionFont === 'comic') {
        fontFamily = `${memeState.captionSize}px Comic Sans MS, cursive`;
      } else {
        fontFamily = `${memeState.captionSize}px Arial, sans-serif`;
      }
      
      // Set font
      ctx.font = fontFamily;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Determine which caption to use - custom or selected
      const captionText = memeState.useCustomCaption && memeState.customCaption 
        ? memeState.customCaption 
        : memeState.selectedCaption;
      
      // Draw the caption
      if (captionText) {
        // If caption is too long, wrap it
        if (captionText.length > 60) {
          // Split into multiple lines for long captions
          const words = captionText.split(' ');
          let line = '';
          const lines = [];
          const maxWidth = canvas.width - 40;
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
              lines.push(line);
              line = words[i] + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line);
          
          // Draw each line
          for (let i = 0; i < lines.length; i++) {
            const yOffset = (i - (lines.length - 1) / 2) * memeState.captionSize * 1.2;
            ctx.fillText(`${lines[i]}`, canvas.width / 2, textY + yOffset, maxWidth);
          }
        } else {
          // Draw as a single line
          ctx.fillText(`"${captionText}"`, canvas.width / 2, textY, canvas.width - 20);
        }
      }
      
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
  
  const getPositionClass = () => {
    switch(memeState.captionPosition) {
      case 'top':
        return 'top-0';
      case 'center':
        return 'top-1/2 transform -translate-y-1/2';
      case 'bottom':
      default:
        return 'bottom-0';
    }
  };
  
  // Function to download the meme directly
  const downloadMeme = () => {
    if (!generatedMemeUrl) return;
    
    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = generatedMemeUrl;
      link.download = 'toolmemex-meme.png';
      
      // Append to the body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Inform user
      alert('Download started!');
    } catch (error) {
      console.error('Error downloading meme:', error);
      alert('Download failed. Try right-clicking the image and selecting "Save Image As..." instead.');
    }
  };
  
  // Function to copy the meme to clipboard
  const copyToClipboard = async () => {
    if (!generatedMemeUrl) return;
    
    try {
      // Split the base64 string to get actual base64 data
      const base64Data = generatedMemeUrl.split(',')[1];
      
      // Create a Blob from the base64 data
      const blob = await fetch(generatedMemeUrl).then(res => res.blob());
      
      // Create a ClipboardItem
      if (navigator.clipboard && navigator.clipboard.write) {
        const clipboardItem = new ClipboardItem({
          [blob.type]: blob
        });
        
        // Write to clipboard
        await navigator.clipboard.write([clipboardItem]);
        alert('Meme copied to clipboard!');
      } else {
        // Fallback method - create an image and try to copy it
        const img = document.createElement('img');
        img.src = generatedMemeUrl;
        img.style.position = 'fixed';
        img.style.left = '-9999px';
        document.body.appendChild(img);
        
        // Wait for image to load
        await new Promise(resolve => {
          img.onload = resolve;
        });
        
        // Create a range and selection
        const range = document.createRange();
        range.selectNode(img);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Try to copy
          document.execCommand('copy');
          selection.removeAllRanges();
        }
        document.body.removeChild(img);
        
        alert('Meme copied to clipboard!');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard. Try using the download option instead.');
    }
  };
  
  return (
    <>
      {(!memeState.uploadedImage || (!memeState.selectedCaption && !memeState.useCustomCaption)) ? (
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
            <div className={`absolute ${getPositionClass()} left-0 right-0 p-4 bg-[#0C0C14]/80 backdrop-blur-sm`}>
              <p 
                className={`text-center font-medium ${getFontClass()} ${getColorClass()}`}
                style={{ fontSize: `${memeState.captionSize}px` }}
              >
                "{memeState.useCustomCaption ? memeState.customCaption : memeState.selectedCaption}"
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
            

            
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setMemeState({
                  ...memeState,
                  darkMode: !memeState.darkMode
                })}
              >
                {memeState.darkMode ? (
                  <SunIcon className="h-4 w-4 mr-2" />
                ) : (
                  <MoonIcon className="h-4 w-4 mr-2" />
                )}
                {memeState.darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
            
            <Tabs defaultValue="edit" className="w-full glass rounded-lg">
              <TabsList className="w-full bg-[#0C0C14] border-b border-[rgba(255,255,255,0.1)]">
                <TabsTrigger value="edit" className="flex-1 data-[state=active]:text-[#00C6FF]">
                  Edit Caption
                </TabsTrigger>
                <TabsTrigger value="style" className="flex-1 data-[state=active]:text-[#00C6FF]">
                  Style Presets
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 data-[state=active]:text-[#00C6FF]">
                  Saved Memes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="p-4">
                <h4 className="font-heading text-sm uppercase text-gray-400 mb-3">Custom Caption</h4>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id="useCustomCaption"
                      className="rounded-sm mr-2 h-4 w-4 accent-[#00C6FF]" 
                      checked={memeState.useCustomCaption}
                      onChange={(e) => {
                        // If switching to custom caption mode and no custom caption yet,
                        // initialize with the selected caption
                        if (e.target.checked && !memeState.customCaption && memeState.selectedCaption) {
                          setMemeState({
                            ...memeState,
                            useCustomCaption: true,
                            customCaption: memeState.selectedCaption
                          });
                        } else {
                          setMemeState({
                            ...memeState,
                            useCustomCaption: e.target.checked
                          });
                        }
                      }}
                    />
                    <Label htmlFor="useCustomCaption" className="text-sm text-white cursor-pointer">
                      Edit Caption Manually
                    </Label>
                  </div>
                  
                  {memeState.useCustomCaption && (
                    <textarea
                      className="w-full h-24 bg-[#0C0C14] border border-[rgba(255,255,255,0.2)] rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00C6FF]"
                      placeholder="Enter your custom caption here..."
                      value={memeState.customCaption || ''}
                      onChange={(e) => setMemeState({
                        ...memeState,
                        customCaption: e.target.value
                      })}
                    ></textarea>
                  )}
                </div>
                
                <h4 className="font-heading text-sm uppercase text-gray-400 mb-2">Caption Styling</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Font Size: {memeState.captionSize}px</Label>
                    <div className="flex items-center">
                      <span className="text-xs mr-2">12</span>
                      <input 
                        type="range" 
                        min="12" 
                        max="36" 
                        step="1"
                        className="flex-1 accent-[#00C6FF]"
                        value={memeState.captionSize}
                        onChange={(e) => setMemeState({
                          ...memeState,
                          captionSize: parseInt(e.target.value)
                        })}
                      />
                      <span className="text-xs ml-2">36</span>
                    </div>
                  </div>
                  <div>
                    <Label className="block text-sm text-gray-400 mb-1">Position</Label>
                    <Select 
                      onValueChange={(val) => setMemeState({
                        ...memeState,
                        captionPosition: val
                      })} 
                      value={memeState.captionPosition}
                    >
                      <SelectTrigger className="w-full bg-[#0C0C14] border border-[rgba(255,255,255,0.05)] rounded-lg">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="p-4">
                <MemeStylePresets memeState={memeState} setMemeState={setMemeState} />
              </TabsContent>
              
              <TabsContent value="history" className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-sm uppercase text-gray-400">Saved Memes</h4>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    className="text-xs bg-[rgba(255,255,255,0.1)] border-0"
                    onClick={() => {
                      if (!generatedMemeUrl) {
                        viewMeme(); // First, generate the meme if it doesn't exist
                        return;
                      }
                      
                      // Save the current meme to history
                      const newSavedMeme = {
                        id: Math.random().toString(36).substring(2, 9),
                        imageUrl: generatedMemeUrl,
                        caption: memeState.useCustomCaption 
                          ? memeState.customCaption || '' 
                          : memeState.selectedCaption || '',
                        timestamp: Date.now()
                      };
                      
                      setMemeState({
                        ...memeState,
                        savedMemes: [...(memeState.savedMemes || []), newSavedMeme]
                      });
                      
                      alert('Meme saved to your collection!');
                    }}
                  >
                    <SaveIcon className="h-3 w-3 mr-1" />
                    Save Current Meme
                  </Button>
                </div>
                
                {(!memeState.savedMemes || memeState.savedMemes.length === 0) ? (
                  <div className="text-center py-8 text-gray-400">
                    <HistoryIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No saved memes yet</p>
                    <p className="text-sm mt-1">Save your creations to access them later</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                    {memeState.savedMemes.map((savedMeme) => (
                      <div 
                        key={savedMeme.id} 
                        className="glass rounded-lg p-2 hover:border hover:border-[#00C6FF] transition-all cursor-pointer"
                        onClick={() => {
                          setGeneratedMemeUrl(savedMeme.imageUrl);
                          setDialogOpen(true);
                        }}
                      >
                        <div className="relative rounded-md overflow-hidden">
                          <img 
                            src={savedMeme.imageUrl} 
                            alt="Saved meme" 
                            className="w-full h-auto"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-xs text-white truncate">
                            {savedMeme.caption.length > 30 
                              ? savedMeme.caption.substring(0, 30) + '...' 
                              : savedMeme.caption}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">
                          {new Date(savedMeme.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      
      {/* Dialog that shows full meme with saving instructions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#0C0C14] border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading text-center mb-4 text-[#00C6FF]">Your Meme Is Ready!</DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              Click the Download button or use one of the options below
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
              
              <div className="flex flex-col gap-3 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={downloadMeme}
                    className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Meme
                  </Button>
                
                  <Button 
                    onClick={copyToClipboard}
                    className="w-full bg-[#9333EA] hover:bg-[#7E22CE] text-white flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy to Clipboard
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
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
                </div>
                
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