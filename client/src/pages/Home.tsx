import { useState } from "react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import CaptionGenerator from "@/components/CaptionGenerator";
import MemePreview from "@/components/MemePreview";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import ProUpgradeModal from "@/components/ProUpgradeModal";
import { Card } from "@/components/ui/card";

// Main application state interface
export interface MemeState {
  uploadedImage: string | null;
  selectedCaption: string | null;
  customCaption: string | null;   // For manually editing the caption
  captionStyle: string;
  captionFont: string;
  captionColor: string;
  captionSize: number;           // Font size for the caption
  captionPosition: string;       // Position of the caption (top, bottom, center)
  useCustomCaption: boolean;     // Whether to use the custom caption or the selected one
}

const Home = () => {
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [memeState, setMemeState] = useState<MemeState>({
    uploadedImage: null,
    selectedCaption: null,
    customCaption: null,
    captionStyle: 'funny',
    captionFont: 'impact',
    captionColor: 'white',
    captionSize: 24,
    captionPosition: 'bottom',
    useCustomCaption: false,
  });

  const [showFallbackMessage, setShowFallbackMessage] = useState(false);

  return (
    <div className="min-h-screen text-white">
      <Header onUpgradeClick={() => setIsProModalOpen(true)} />

      <main className="container mx-auto px-4 pb-20">
        {/* Hero Section */}
        <section className="text-center mb-10 mt-6 md:mt-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4 leading-tight">
            <span className="bg-gradient-to-r from-[#00C6FF] to-[#6E11F4] bg-clip-text text-transparent">
              Craft Viral Memes
            </span>
            <br />
            <span className="text-white">with AI-Powered Captions</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Upload your image and our advanced AI will generate the perfect captions to make your meme go viral.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column: Upload & Generator Card */}
          <Card className="glass rounded-2xl p-6 md:p-8 neon-border">
            <h3 className="font-heading text-xl mb-6">Upload Your Image</h3>
            
            <ImageUploader 
              memeState={memeState} 
              setMemeState={setMemeState} 
            />
            
            <CaptionGenerator 
              memeState={memeState} 
              setMemeState={setMemeState} 
            />
          </Card>

          {/* Right Column: Preview & Export Card */}
          <Card className="glass rounded-2xl p-6 md:p-8 neon-border">
            <h3 className="font-heading text-xl mb-6">Meme Preview</h3>
            
            <MemePreview 
              memeState={memeState} 
              setMemeState={setMemeState}
              onShareClick={() => setIsProModalOpen(true)}
              onFallbackMessage={() => {
                setShowFallbackMessage(true);
                setTimeout(() => setShowFallbackMessage(false), 3000);
              }}
            />
          </Card>
        </div>

        {/* Features Section */}
        <FeaturesSection />
      </main>

      <Footer />

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />

      {/* AVIF Web Worker Fallback Message */}
      {showFallbackMessage && (
        <div className="fixed bottom-4 right-4 glass rounded-lg p-4 max-w-xs neon-border z-50">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00C6FF] mr-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="mb-1">AVIF conversion not supported in your browser.</p>
              <p className="text-sm text-gray-400">Downloading as PNG instead.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
