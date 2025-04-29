// components/modal/ProUpgradeModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useProModal } from "@/hooks/useProModal";
import { Check, Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Remove watermark",
  "HD meme export (AVIF/WebP)",
  "AI-generated captions",
  "Unlimited meme saves",
  "Priority export speed",
];

const ProUpgradeModal = () => {
  const { isOpen, onClose } = useProModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-2xl border bg-background shadow-xl">
        <DialogHeader className="flex flex-col items-center text-center">
          <Crown className="w-10 h-10 text-yellow-400 mb-2" />
          <DialogTitle className="text-2xl font-bold">Upgrade to ToolMemeX Pro</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Unlock premium features and take your meme game to the next level.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-3 my-4 text-sm">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-3 mt-4">
          <Button className="w-full bg-gradient-to-r from-[#00C6FF] to-[#6E11F4] text-white hover:opacity-90 transition-all">
            Monthly – $4.99/mo
          </Button>
          <Button variant="outline" className="w-full border-[#6E11F4] text-[#6E11F4] hover:bg-[#6E11F4]/10 transition-all">
            Yearly – $49.99/yr (save 15%)
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:underline"
          >
            No thanks, maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProUpgradeModal;