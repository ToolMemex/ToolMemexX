/**
 * Mock AI caption generation function
 * @param style - The style of captions to generate
 * @returns An array of captions
 */
export function generateCaptions(style: string): string[] {
  const captionSets: Record<string, string[]> = {
    funny: [
      "When you finally understand the JavaScript code you wrote 3 months ago.",
      "That moment when your code works on the first try and you have no idea why.",
      "Nobody: Me debugging at 3AM: *this image*",
      "How I look trying to explain programming to my non-tech friends."
    ],
    sarcastic: [
      "Oh sure, let me just quickly learn quantum physics while I'm waiting for this npm install.",
      "My face when someone says 'it should be an easy fix'.",
      "Wow, another Stack Overflow solution that's only 5 years outdated.",
      "Yeah, I totally meant to write that bug. It's a feature now."
    ],
    motivational: [
      "Code like nobody's watching your GitHub commits.",
      "Every expert was once a beginner. Keep pushing forward.",
      "Bugs are just opportunities for improvement in disguise.",
      "Dream in code. Build with passion. Debug with patience."
    ],
    dark: [
      "My code doesn't have bugs. It develops random unexpected features.",
      "The only thing darker than this meme is my code without comments.",
      "I told them I'd fix the bug. I never said when.",
      "How my soul looks after looking at legacy code."
    ]
  };
  
  return captionSets[style] || captionSets.funny;
}

/**
 * Convert a base64 image to a Blob
 * @param base64 - Base64 encoded image
 * @returns Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  
  return new Blob([uInt8Array], { type: contentType });
}
