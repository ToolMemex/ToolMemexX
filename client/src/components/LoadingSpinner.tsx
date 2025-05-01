// src/components/ui/LoadingSpinner.tsx

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-40 relative">
      <div className="w-24 h-24 relative">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
        {/* Middle ring */}
        <div className="absolute inset-2 border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-medium"></div>
        {/* Inner ring */}
        <div className="absolute inset-4 border-4 border-t-pink-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-fast"></div>
      </div>
      <div className="absolute text-white font-bold text-xl">Loading...</div>
    </div>
  );
};

export default LoadingSpinner;