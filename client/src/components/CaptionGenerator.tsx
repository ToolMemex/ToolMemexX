import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { WandSparklesIcon, CheckIcon, CheckCheckIcon, Loader2 } from "lucide-react";
import { generateCaptions } from "@/lib/memeUtils";
import type { MemeState } from "@/pages/Home";

interface CaptionGeneratorProps {
  memeState: MemeState;
  setMemeState: React.Dispatch<React.SetStateAction<MemeState>>;
}

const CaptionGenerator: FC<CaptionGeneratorProps> = ({ memeState, setMemeState }) => {
  const [captions, setCaptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateCaptions = () => {
    if (!memeState.uploadedImage) return;
    
    setIsGenerating(true);
    // Simulate AI processing time - no console logs needed
    setTimeout(() => {
      const generatedCaptions = generateCaptions(memeState.captionStyle);
      setCaptions(generatedCaptions);
      
      // Select the first caption by default
      if (generatedCaptions.length > 0) {
        setMemeState({
          ...memeState,
          selectedCaption: generatedCaptions[0]
        });
      }
      
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleStyleChange = (style: string) => {
    setMemeState({
      ...memeState,
      captionStyle: style
    });
    
    // Regenerate captions with new style
    const generatedCaptions = generateCaptions(style);
    setCaptions(generatedCaptions);
    
    // Select the first caption by default
    if (generatedCaptions.length > 0) {
      setMemeState(prev => ({
        ...prev,
        selectedCaption: generatedCaptions[0]
      }));
    }
  };
  
  const selectCaption = (caption: string) => {
    setMemeState({
      ...memeState,
      selectedCaption: caption
    });
  };
  
  const isGenerateButtonDisabled = !memeState.uploadedImage;
  
  return (
    <div>
      <Button
        disabled={isGenerateButtonDisabled}
        onClick={handleGenerateCaptions}
        className={`w-full btn-glow animate-pulse-blue py-4 rounded-xl font-heading ${isGenerateButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <WandSparklesIcon className="h-5 w-5 mr-2" />
            Generate Captions
          </span>
        )}
      </Button>
      
      {captions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-heading text-lg mb-2">Generated Captions</h4>
          
          {/* Caption style options */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className={`px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-sm border ${memeState.captionStyle === 'funny' ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'}`}
              onClick={() => handleStyleChange('funny')}
            >
              Funny
            </button>
            <button 
              className={`px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-sm border ${memeState.captionStyle === 'sarcastic' ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'}`}
              onClick={() => handleStyleChange('sarcastic')}
            >
              Sarcastic
            </button>
            <button 
              className={`px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-sm border ${memeState.captionStyle === 'motivational' ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'}`}
              onClick={() => handleStyleChange('motivational')}
            >
              Motivational
            </button>
            <button 
              className={`px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-sm border ${memeState.captionStyle === 'dark' ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'}`}
              onClick={() => handleStyleChange('dark')}
            >
              Dark Humor
            </button>
            <button 
              className={`px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-sm border ${memeState.captionStyle === 'tech' ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'}`}
              onClick={() => handleStyleChange('tech')}
            >
              Tech
            </button>
            <button 
              className={`px-3 py-1 rounded-full bg-[rgba(255,255,255,0.1)] text-sm border ${memeState.captionStyle === 'techjokes' ? 'border-[#00C6FF]' : 'border-[rgba(255,255,255,0.05)]'}`}
              onClick={() => handleStyleChange('techjokes')}
            >
              Tech Jokes
            </button>
          </div>
          
          {/* Captions list */}
          <div className="space-y-3">
            {captions.map((caption, index) => (
              <div 
                key={index}
                className={`glass rounded-lg p-4 flex justify-between items-center ${memeState.selectedCaption === caption ? 'border border-[#00C6FF]' : ''}`}
              >
                <p className="text-white">"{caption}"</p>
                <button 
                  className="text-[#00C6FF] hover:text-white rounded-full p-2 hover:bg-[#00C6FF]/20 transition-all"
                  onClick={() => selectCaption(caption)}
                >
                  {memeState.selectedCaption === caption ? (
                    <CheckCheckIcon className="h-5 w-5" />
                  ) : (
                    <CheckIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptionGenerator;
