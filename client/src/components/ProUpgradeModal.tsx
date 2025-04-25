import { FC } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CrownIcon, X, CheckIcon } from "lucide-react";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProUpgradeModal: FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass rounded-2xl max-w-md w-full p-6 md:p-8 neon-border relative mx-4 border-none">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#6E11F4] to-[#00C6FF] flex items-center justify-center">
            <CrownIcon className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-2xl mb-2">Upgrade to Pro</h3>
          <p className="text-gray-300">Unlock premium features and take your memes to the next level</p>
        </div>
        
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-heading text-xl">Pro Plan</span>
            <span className="bg-[#6E11F4]/20 text-[#6E11F4] px-3 py-1 rounded-full text-sm">50% OFF</span>
          </div>
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-heading">$4.99</span>
            <span className="text-gray-400 line-through ml-2">$9.99</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          <ul className="space-y-3 mb-4">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-[#00C6FF] mr-2 mt-1" />
              <span>Unlimited caption generations</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-[#00C6FF] mr-2 mt-1" />
              <span>Advanced caption styles and formatting</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-[#00C6FF] mr-2 mt-1" />
              <span>Premium templates and effects</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-[#00C6FF] mr-2 mt-1" />
              <span>Remove ToolMemeX watermark</span>
            </li>
          </ul>
        </div>
        
        <Button className="w-full btn-glow animate-pulse-blue py-4 rounded-xl font-heading mb-4">
          <span className="flex items-center justify-center">
            <CrownIcon className="h-5 w-5 mr-2" />
            Get Pro Now
          </span>
        </Button>
        
        <p className="text-xs text-center text-gray-500">Cancel anytime. No commitment required.</p>
      </DialogContent>
    </Dialog>
  );
};

export default ProUpgradeModal;
