import { FC, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ShareIcon, ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { MemeState } from "@/pages/Home";

interface MemePreviewProps {
  memeState: MemeState;
  setMemeState: React.Dispatch<React.SetStateAction<MemeState>>;
  onShareClick: () => void;
  onFallbackMessage: () => void;
}

const MemePreview: FC<MemePreviewProps> = ({ 
  memeState, 
  setMemeState, 
  onShareClick, 
  onFallbackMessage 
}) => {
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
      
      // Check if worker is available
      if (!workerRef.current) {
        console.log('Web Worker not available, falling back to PNG');
        onFallbackMessage();
        downloadAsImage(canvas.toDataURL('image/png'), 'meme.png');
        return;
      }
      
      console.log('Sending image to Web Worker for processing');
      
      // Set up message handler before sending the message
      workerRef.current.onmessage = function(e: MessageEvent) {
        console.log('Received response from Web Worker:', e.data.status);
        if (e.data.status === 'success') {
          // In a real implementation, this would use the AVIF data
          // For this demo, we'll just use PNG
          console.log('Downloading image as AVIF (actually PNG)');
          downloadAsImage(canvas.toDataURL('image/png'), 'meme.avif');
        } else {
          console.error('Web Worker processing failed, falling back to PNG');
          onFallbackMessage();
          downloadAsImage(canvas.toDataURL('image/png'), 'meme.png');
        }
      };
      
      // Add error handler
      workerRef.current.onerror = function(error) {
        console.error('Web Worker error:', error);
        onFallbackMessage();
        downloadAsImage(canvas.toDataURL('image/png'), 'meme.png');
      };
      
      // Send to worker for processing
      try {
        workerRef.current.postMessage({
          imageData: canvas.toDataURL('image/png')
        });
      } catch (error) {
        console.error('Error sending message to Web Worker:', error);
        onFallbackMessage();
        downloadAsImage(canvas.toDataURL('image/png'), 'meme.png');
      }
    };
    
    img.onerror = function(error) {
      console.error('Failed to load image:', error);
      onFallbackMessage();
    };
    
    img.src = memeState.uploadedImage;
  };
  
  // Helper function to download image
  const downloadAsImage = (dataUrl: string, fileName: string) => {
    console.log('Creating download link for:', fileName);
    
    try {
      // For mobile compatibility, we'll use a different approach
      // Convert the data URL to a blob
      const parts = dataUrl.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      
      const blob = new Blob([uInt8Array], { type: contentType });
      
      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create link and set properties
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.target = '_blank'; // Try adding this for mobile browsers
      link.rel = 'noopener noreferrer';
      
      // Append to document
      document.body.appendChild(link);
      
      // Click immediately
      console.log('Clicking download link for blob URL');
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        console.log('Download resources cleaned up');
      }, 200);
    } catch (error) {
      console.error('Download error:', error);
      
      // Fallback method for problematic browsers
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Download Your Meme</title>
              <style>
                body { 
                  font-family: Arial, sans-serif;
                  text-align: center;
                  padding: 20px;
                  background-color: #f0f0f0;
                }
                img {
                  max-width: 100%;
                  border: 1px solid #ccc;
                  margin-bottom: 20px;
                }
                .instruction {
                  margin-bottom: 20px;
                }
              </style>
            </head>
            <body>
              <h2>Your ToolMemeX Creation</h2>
              <img src="${dataUrl}" alt="Your meme">
              <div class="instruction">Right-click on the image and select "Save Image As..." to download</div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
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
                <div className="dropdown w-full">
                  <Button 
                    onClick={downloadMeme}
                    className="w-full btn-glow py-3 rounded-xl font-heading flex items-center justify-center"
                  >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Download Image
                  </Button>
                  
                  {/* Alternative download method for mobile browsers */}
                  <Button
                    onClick={() => {
                      if (!memeState.uploadedImage || !memeState.selectedCaption) return;
                      
                      // Open in new window as a fallback method
                      const newWindow = window.open();
                      if (newWindow) {
                        // Create a canvas to render the meme
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        
                        const img = new Image();
                        img.onload = function() {
                          // Set canvas dimensions
                          canvas.width = img.width;
                          canvas.height = img.height;
                          
                          // Draw image and caption
                          ctx.drawImage(img, 0, 0);
                          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                          ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
                          
                          // Draw caption text with selected styles
                          ctx.fillStyle = 
                            memeState.captionColor === 'yellow' ? '#FBBF24' : 
                            memeState.captionColor === 'neon' ? '#00C6FF' : '#FFFFFF';
                          
                          ctx.font = 
                            memeState.captionFont === 'impact' ? 'bold 28px Impact, sans-serif' : 
                            memeState.captionFont === 'comic' ? '28px Comic Sans MS, cursive' : 
                            '28px Arial, sans-serif';
                          
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(`"${memeState.selectedCaption}"`, canvas.width / 2, canvas.height - 40, canvas.width - 20);
                          
                          // Watermark
                          ctx.font = '12px Arial, sans-serif';
                          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                          ctx.fillText('ToolMemeX', canvas.width - 50, canvas.height - 10);
                          
                          // Write to new window
                          const dataUrl = canvas.toDataURL('image/png');
                          newWindow.document.write(`
                            <html>
                              <head>
                                <title>Your Meme - Save Image</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  body { 
                                    font-family: system-ui, sans-serif;
                                    text-align: center;
                                    padding: 20px;
                                    background-color: #0C0C14;
                                    color: #fff;
                                    max-width: 600px;
                                    margin: 0 auto;
                                  }
                                  img {
                                    max-width: 100%;
                                    border-radius: 8px;
                                    margin-bottom: 20px;
                                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                                  }
                                  .instruction {
                                    background: rgba(255,255,255,0.1);
                                    padding: 15px;
                                    border-radius: 8px;
                                    margin-bottom: 20px;
                                    font-size: 15px;
                                    line-height: 1.5;
                                  }
                                  h2 {
                                    color: #00C6FF;
                                    margin-bottom: 20px;
                                  }
                                </style>
                              </head>
                              <body>
                                <h2>Your ToolMemeX Creation</h2>
                                <img src="${dataUrl}" alt="Your meme">
                                <div class="instruction">
                                  Press and hold on the image (or right-click) and select "Save Image" to download
                                </div>
                              </body>
                            </html>
                          `);
                          newWindow.document.close();
                        };
                        img.src = memeState.uploadedImage;
                      }
                    }}
                    variant="outline"
                    className="mt-2 w-full rounded-xl font-heading text-sm py-2 bg-[#10101C]/60 border border-[rgba(255,255,255,0.05)]"
                  >
                    Alternative Download Method
                  </Button>
                </div>
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
