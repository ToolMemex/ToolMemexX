// src/pages/UploadPage.tsx

import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useSEO("Upload Meme - ToolMemeX", "Upload your custom memes and edit them with ToolMemeX AI tools.");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    // Simulate upload delay (in real app you can POST to server)
    setTimeout(() => {
      alert("Upload successful!");
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <Header />

      <main className="w-full max-w-4xl flex flex-col gap-8 px-6 py-10">
        <h1 className="text-3xl font-bold text-center">Upload Your Meme</h1>

        <Card className="p-6 flex flex-col items-center gap-6">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-80 object-contain rounded-xl shadow-md"
            />
          )}

          <Button
            disabled={!file || uploading}
            onClick={handleUpload}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Meme"}
          </Button>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default UploadPage;