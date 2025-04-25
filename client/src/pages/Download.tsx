import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share } from 'lucide-react';

const DownloadPage = () => {
  const [, setLocation] = useLocation();
  const [imageData, setImageData] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [downloadAttempted, setDownloadAttempted] = useState(false);
  
  // Parse URL parameters on component mount
  useEffect(() => {
    try {
      // Get params from URL
      const params = new URLSearchParams(window.location.search);
      const encodedImageData = params.get('image');
      const encodedCaption = params.get('caption');
      
      if (encodedImageData) {
        const decodedImage = decodeURIComponent(encodedImageData);
        setImageData(decodedImage);
      }
      
      if (encodedCaption) {
        const decodedCaption = decodeURIComponent(encodedCaption);
        setCaption(decodedCaption);
      }
    } catch (error) {
      console.error('Error parsing download parameters:', error);
    }
  }, []);
  
  // Function to handle the download
  const handleDownload = () => {
    setDownloadAttempted(true);
    
    if (!imageData) return;
    
    try {
      // Create link and trigger download
      const link = document.createElement('a');
      link.href = imageData;
      link.download = 'meme.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  // Return to home
  const returnToEditor = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      <header className="py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="font-heading text-xl text-[#00C6FF]">ToolMemeX</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={returnToEditor}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          </div>
          
          <div className="glass rounded-2xl p-6 mb-8 neon-border">
            <h2 className="font-heading text-2xl mb-6 text-center">Your Meme Is Ready!</h2>
            
            {imageData ? (
              <div className="flex flex-col items-center">
                <div className="relative glass rounded-xl overflow-hidden mb-8 max-w-xl mx-auto">
                  <img 
                    src={imageData}
                    alt="Your meme"
                    className="w-full h-auto"
                  />
                  {caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0C0C14]/80 backdrop-blur-sm">
                      <p className="text-lg text-center font-medium">
                        "{caption}"
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="w-full max-w-md mx-auto space-y-4">
                  <Button 
                    onClick={handleDownload}
                    className="w-full btn-glow py-3 rounded-xl font-heading flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Meme
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 mt-2">
                    {downloadAttempted && (
                      <p>
                        If the download didn't start automatically, right-click on the image and select "Save Image As..."
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-3 rounded-xl font-heading bg-[#10101C] border border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-all flex items-center justify-center"
                    onClick={() => window.open('/', '_self')}
                  >
                    <Share className="h-5 w-5 mr-2" />
                    Create Another Meme
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No meme data found. Please go back and create a new meme.</p>
                <Button 
                  onClick={returnToEditor}
                  className="mt-4 btn-glow py-2 px-4 rounded-xl font-heading"
                >
                  Create New Meme
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <p>Made with ToolMemeX &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DownloadPage;