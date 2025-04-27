// src/pages/Home.tsx

import { useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import CaptionGenerator from "@/components/CaptionGenerator";
import MemePreview from "@/components/MemePreview";
import FeaturesSection from "@/components/FeaturesSection";
import { DownloadButton } from "@/components/DownloadButton";
import { Card } from "@/components/ui/card";

// Lazy-load rarely used modals
const ProUpgradeModal = lazy(() => import("@/components/ProUpgradeModal"));

// --- Types ---
type Position = "top" | "bottom" | "center";

interface StylePreset {
  name: string;
  font: string;
  color: string;
  size: number;
  position: Position;
  description: string;
}

interface SavedMeme {
  id: string;
  imageUrl: string;
  caption: string;
  timestamp: number;
}

interface MemeState {
  uploadedImage: string | null;
  selectedCaption: string | null;
  customCaption: string | null;
  captionStyle: string;
  captionFont: string;
  captionColor: string;
  captionSize: number;
  captionPosition: Position;
  useCustomCaption: boolean;
  darkMode: boolean;
  savedMemes: SavedMeme[];
}

// --- Main Component ---
const Home = () => {
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const [memeState, setMemeState] = useState<MemeState>({
    uploadedImage: null,
    selectedCaption: null,
    customCaption: null,
    captionStyle: "funny",
    captionFont: "Impact",
    captionColor: "#FFFFFF",
    captionSize: 32,
    captionPosition: "bottom",
    useCustomCaption: false,
    darkMode: true,
    savedMemes: [],
  });

  const openProModal = () => setIsProModalOpen(true);
  const closeProModal = () => setIsProModalOpen(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <Header />

      <main className="w-full max-w-6xl flex flex-col gap-10 px-6 py-8">
        <Card className="p-4">
          <ImageUploader />
        </Card>

        <Card className="p-4">
          <CaptionGenerator />
        </Card>

        <Card className="p-4">
          <MemePreview />
          <div className="mt-4 flex justify-center">
            <DownloadButton />
          </div>
        </Card>

        <FeaturesSection />
      </main>

      <Footer />

      <Suspense fallback={<div>Loading...</div>}>
        {isProModalOpen && <ProUpgradeModal open={isProModalOpen} onOpenChange={closeProModal} />}
      </Suspense>
    </div>
  );
};

export default Home;