// src/components/ui/LoadingSpinner.tsx

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-24 h-24 relative">
        <div className="absolute inset-0 animate-spin rounded-full border-8 border-transparent border-solid
          border-t-transparent border-b-transparent border-l-4 border-r-4 border-l-gradient-to-tl from-blue-500 via-green-500 to-yellow-500 
          shadow-xl transform-gpu rotate-45
          animate-[spin_1.5s_linear_infinite]">
        </div>

        <div className="absolute inset-0 rounded-full border-8 border-transparent border-solid border-t-transparent 
          border-b-transparent border-l-4 border-r-4 border-l-gradient-to-tr from-red-500 via-orange-500 to-yellow-500 
          shadow-2xl transform-gpu rotate-45 animate-[spin_2s_linear_infinite]">
        </div>

        <div className="absolute inset-0 animate-pulse rounded-full border-8 border-transparent border-solid
          border-t-transparent border-b-transparent border-l-4 border-r-4 border-l-gradient-to-b from-pink-500 to-purple-500 
          shadow-lg transform-gpu rotate-45">
        </div>
      </div>

      <div className="absolute inset-0 flex justify-center items-center text-2xl font-bold text-white text-shadow-md">
        Loading...
      </div>
    </div>
  );
};

export default LoadingSpinner;