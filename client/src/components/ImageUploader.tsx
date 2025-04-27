import { FC, useState, useRef, useCallback } from "react";
import { ImageIcon, X } from "lucide-react";
import type { MemeState } from "@/pages/Home";
import { useToast } from "@/components/ui/use-toast";
import { compressImageWithCanvas } from "@/lib/image-optimizer";
import { useDropzone } from "react-dropzone";
import { Blurhash } from "react-blurhash";

interface ImageUploaderProps {
  memeState: MemeState;
  setMemeState: React.Dispatch<React.SetStateAction<MemeState>>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const ImageUploader: FC<ImageUploaderProps> = ({ memeState, setMemeState }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showBlur, setShowBlur] = useState(true);

  const processImage = useCallback(
    async (file: File) => {
      try {
        setIsProcessing(true);
        setRetryCount(0);

        if (!ACCEPTED_TYPES.includes(file.type)) {
          throw new Error("Unsupported format. Use JPEG, PNG, WEBP, or AVIF.");
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(
            `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`,
          );
        }

        const optimizedFile = await compressImageWithCanvas(file, {
          maxWidth: 1800,
          quality: 0.8,
          fallbackToWebP: true,
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setMemeState((prev) => ({
              ...prev,
              uploadedImage: e.target!.result as string,
              originalFile: optimizedFile,
            }));
          }
        };
        reader.readAsDataURL(optimizedFile);
      } catch (error: any) {
        if (retryCount < 2) {
          setRetryCount((prev) => prev + 1);
          toast({
            title: "Retrying upload...",
            description: `Retry ${retryCount + 1}/3`,
          });
          setTimeout(() => processImage(file), 1000);
        } else {
          toast({
            title: "Upload Failed",
            description: error.message || "Unknown error",
            variant: "destructive",
          });
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [setMemeState, toast, retryCount],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) processImage(acceptedFiles[0]);
    },
    accept: {
      "image/*": [".jpeg", ".png", ".webp", ".avif"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    noClick: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processImage(e.target.files[0]);
  };

  const clearImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowBlur(true);
      setMemeState((prev) => ({
        ...prev,
        uploadedImage: "",
        originalFile: null,
      }));
    },
    [setMemeState],
  );

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "bg-blue-900/20 border-blue-400"
          : "bg-gray-800/30 border-gray-600"
      } ${isProcessing ? "opacity-60 pointer-events-none" : ""}`}
      onClick={() => fileInputRef.current?.click()}
    >
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {memeState.uploadedImage ? (
        <div className="relative group">
          {showBlur && (
            <Blurhash
              hash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
              width="100%"
              height={160}
              resolutionX={32}
              resolutionY={32}
              punch={1}
              className="rounded-xl"
            />
          )}
          <img
            src={memeState.uploadedImage}
            alt="Uploaded preview"
            className="max-w-full max-h-64 mx-auto rounded-xl transition-opacity duration-500"
            style={{ opacity: showBlur ? 0 : 1 }}
            onLoad={() => setShowBlur(false)}
            loading="lazy"
            decoding="async"
          />
          <button
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-red-600 transition"
            onClick={clearImage}
            aria-label="Remove image"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-white opacity-80">
          <ImageIcon size={32} />
          <p className="text-sm">
            {isDragActive ? "Drop image here" : "Tap or drag image to upload"}
          </p>
          <p className="text-xs text-gray-400">
            Max 5MB • JPEG, PNG, WEBP, AVIF
          </p>
        </div>
      )}

      <input
        {...getInputProps()}
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
