// src/components/MemeCard.tsx

import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils"; // (optional) classnames helper if you use it
import { Button } from "@/components/ui/button"; // Assuming you have a nice Button component
import { Trash2 } from "lucide-react"; // Nice trash icon
import Image from "next/image"; // If using Next.js, or your normal <img> if not
import { memo } from "react";

interface MemeCardProps {
  meme: {
    id: string;
    url: string;
    title?: string;
    createdAt: string;
  };
  onDelete?: (id: string) => void;
}

const MemeCard = ({ meme, onDelete }: MemeCardProps) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(meme.id);
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-background"
      )}
    >
      <div className="relative w-full aspect-[4/5] bg-muted">
        <img
          src={meme.url}
          alt={meme.title || "Saved Meme"}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          className="rounded-full p-2"
        >
          <Trash2 size={18} />
        </Button>
      </div>

      {meme.title && (
        <div className="p-2 text-center text-sm font-medium truncate">
          {meme.title}
        </div>
      )}
    </div>
  );
};

export default memo(MemeCard);