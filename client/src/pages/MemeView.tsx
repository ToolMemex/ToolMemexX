import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MemeView = () => {
  const [, setLocation] = useLocation();
  const [imageData, setImageData] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the image data from localStorage
    const storedImage = localStorage.getItem('currentMeme');
    if (storedImage) {
      setImageData(storedImage);
    }
  }, []);
  
  const goBack = () => {
    setLocation('/');
  };
  
  if (!imageData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="glass p-8 rounded-xl">
          <h1 className="text-xl font-heading mb-4">No meme found</h1>
          <p className="text-gray-400 mb-6">Go back and create a meme first.</p>
          <Button 
            onClick={goBack}
            className="btn-glow"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Meme Generator
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <Button 
          onClick={goBack}
          variant="outline"
          className="bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Editor
        </Button>
        
        <div className="text-gray-400 text-sm bg-[rgba(255,255,255,0.1)] px-3 py-1 rounded-lg">
          Right-click on the image to save it
        </div>
      </div>
      
      <div className="glass p-4 rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-xl font-heading text-[#00C6FF]">Your Meme</h1>
          <p className="text-gray-400 text-sm">Right-click (or press and hold) on the image below and select "Save Image As..."</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <img 
            src={imageData} 
            alt="Your generated meme" 
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default MemeView;