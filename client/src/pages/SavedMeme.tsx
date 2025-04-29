// src/app/(profile)/SavedMemes.tsx

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { storage, Meme } from "@/lib/storage";
import { MemeCard } from "@/components/MemeCard";
import { useToast } from "@/components/ui/use-toast"; // Import your Toast hook
import { Button } from "@/components/ui/button"; // If you have a Button component

const SavedMemes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    storage.refresh();
    const allMemes = storage.getAll();
    setMemes(
      allMemes.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }, []);

  const handleDelete = (id: string) => {
    storage.delete(id);
    setMemes((prev) => prev.filter((m) => m.id !== id));
  };

  const handleClearAll = () => {
    const confirmed = window.confirm("Are you sure you want to delete all saved memes?");
    if (confirmed) {
      storage.clear();
      setMemes([]);
      toast({
        title: "All memes cleared",
        description: "Your saved memes have been successfully deleted.",
        variant: "success",
      });
    }
  };

  return (
    <section className="p-4 space-y-6">
      {memes.length > 0 && (
        <div className="flex justify-end">
          <Button variant="destructive" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {memes.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="text-2xl font-semibold text-muted-foreground mb-2">
              No saved memes yet.
            </div>
            <div className="text-muted-foreground text-sm">
              Try saving some memes!
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="memes"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {memes.map((meme) => (
                <motion.div
                  key={meme.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <MemeCard meme={meme} onDelete={handleDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SavedMemes;