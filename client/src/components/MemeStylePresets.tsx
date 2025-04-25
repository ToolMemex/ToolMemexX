import { FC } from "react";
import type { MemeState, StylePreset } from "@/pages/Home";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CrownIcon, WandSparklesIcon } from "lucide-react";

interface MemeStylePresetsProps {
  memeState: MemeState;
  setMemeState: React.Dispatch<React.SetStateAction<MemeState>>;
}

// Define preset styles
const stylePresets: StylePreset[] = [
  {
    name: 'Classic Meme',
    font: 'impact',
    color: 'white',
    size: 28,
    position: 'bottom',
    description: 'The classic meme style with Impact font and white text'
  },
  {
    name: 'Minimal',
    font: 'arial',
    color: 'white',
    size: 18,
    position: 'center',
    description: 'Clean, minimal style with smaller text'
  },
  {
    name: 'Bold Statement',
    font: 'impact',
    color: 'yellow',
    size: 32,
    position: 'top',
    description: 'Eye-catching yellow text at the top'
  },
  {
    name: 'Tech Vibe',
    font: 'arial',
    color: 'neon',
    size: 24,
    position: 'bottom',
    description: 'Tech-inspired with neon blue text'
  },
  {
    name: 'Comic Style',
    font: 'comic',
    color: 'pink',
    size: 24,
    position: 'top',
    description: 'Fun comic book style with pink text'
  },
  {
    name: 'Dramatic',
    font: 'impact',
    color: 'purple',
    size: 30,
    position: 'center',
    description: 'Dramatic center-positioned purple text'
  }
];

const MemeStylePresets: FC<MemeStylePresetsProps> = ({ memeState, setMemeState }) => {
  const applyPreset = (preset: StylePreset) => {
    setMemeState({
      ...memeState,
      captionFont: preset.font,
      captionColor: preset.color,
      captionSize: preset.size,
      captionPosition: preset.position
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center mb-4">
        <WandSparklesIcon className="h-5 w-5 text-[#00C6FF] mr-2" />
        <h4 className="font-heading text-lg">Style Presets</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {stylePresets.map((preset, index) => (
          <Card 
            key={index}
            className="glass p-3 cursor-pointer hover:border hover:border-[#00C6FF] transition-all"
            onClick={() => applyPreset(preset)}
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-heading text-sm">{preset.name}</h5>
                {(preset.name === 'Tech Vibe' || preset.name === 'Dramatic') && (
                  <span className="bg-[#00C6FF] text-[#0C0C14] text-xs rounded-full px-2 py-0.5 flex items-center">
                    <CrownIcon className="h-3 w-3 mr-1" />
                    Pro
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {preset.description}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs bg-[rgba(255,255,255,0.1)] border-0 hover:bg-[rgba(255,255,255,0.2)]"
                onClick={(e) => {
                  e.stopPropagation();
                  applyPreset(preset);
                }}
              >
                Apply Style
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemeStylePresets;