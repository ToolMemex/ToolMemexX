// src/pages/Home.tsx
import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { useProModal } from "@/hooks/useProModal"; // ✅ NEW
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUploader from "@/components/ImageUploader";
import CaptionGenerator from "@/components/CaptionGenerator";
import MemePreview from "@/components/MemePreview";
import FeaturesSection from "@/components/FeaturesSection";
import { DownloadButton } from "@/components/DownloadButton";
import { Card } from "@/components/ui/card";

// --- Types ---
type Position = "top" | "bottom" | "center";

interface SavedMeme { /* ... */ }
interface MemeState { /* ... */ }

const Home = () => {
  const { onOpen } = useProModal(); // ✅ NEW
  const [memeState, setMemeState] = useState<MemeState>({
    // ...
  });

  useSEO("ToolMemeX | AI Meme Generator", "Create hilarious AI memes instantly with ToolMemeX. Download in high quality!");

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <Header onUpgradeClick={onOpen} /> {/* ✅ UPDATED */}

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
    </div>
  );
};

export default Home;