import { FC } from "react";
import { SparklesIcon, Zap, LockIcon } from "lucide-react";

const FeaturesSection: FC = () => {
  return (
    <section className="mt-16">
      <h3 className="font-heading text-2xl text-center mb-10">Premium Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full glass mx-auto mb-4 flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-[#00C6FF]" />
          </div>
          <h4 className="font-heading text-lg mb-2">AI-Powered Captions</h4>
          <p className="text-gray-400">Generate unique, engaging captions for any image with our advanced AI</p>
        </div>
        
        {/* Feature 2 */}
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full glass mx-auto mb-4 flex items-center justify-center">
            <Zap className="h-6 w-6 text-[#00C6FF]" />
          </div>
          <h4 className="font-heading text-lg mb-2">Lightning Fast</h4>
          <p className="text-gray-400">Create memes in seconds with our optimized engine and AVIF compression</p>
        </div>
        
        {/* Feature 3 */}
        <div className="glass rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full glass mx-auto mb-4 flex items-center justify-center">
            <LockIcon className="h-6 w-6 text-[#00C6FF]" />
          </div>
          <h4 className="font-heading text-lg mb-2">100% Private</h4>
          <p className="text-gray-400">Your images never leave your browser - all processing happens locally</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
