import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.05)] py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-lg font-heading text-[#00C6FF] mr-2">ToolMemeX</span>
            <span className="text-sm text-gray-500">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-[#00C6FF] transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-[#00C6FF] transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-[#00C6FF] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
