import { FC } from "react";
import { Button } from "@/components/ui/button";
import { SparklesIcon, CrownIcon } from "lucide-react";

interface HeaderProps {
  onUpgradeClick: () => void;
}

const Header: FC<HeaderProps> = ({ onUpgradeClick }) => {
  return (
    <header className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#00C6FF] to-[#6E11F4] flex items-center justify-center">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold">X</span>
            </div>
          </div>
          <h1 className="text-2xl font-heading bg-gradient-to-r from-[#00C6FF] to-[#6E11F4] bg-clip-text text-transparent">
            ToolMemeX
          </h1>
        </div>
        <Button 
          onClick={onUpgradeClick} 
          variant="outline" 
          className="hidden md:flex items-center px-4 py-2 rounded-lg border border-[#6E11F4] text-[#6E11F4] hover:bg-[#6E11F4]/10 transition-all"
        >
          <CrownIcon className="h-4 w-4 mr-2" />
          <span>Upgrade to Pro</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
