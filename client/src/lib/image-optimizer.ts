// lib/image-optimizer.ts

// Temporary basic image optimizer
export const optimizeImage = async (file: File): Promise<File> => {
  // Just return the original file without optimization
  return file;
};

// Dummy canvas-based compression (no actual compression yet)
export const compressImageWithCanvas = async (file: File): Promise<File> => {
  return file;
};