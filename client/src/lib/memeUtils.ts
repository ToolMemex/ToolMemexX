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
      "How I look trying to explain programming to my non-tech friends.",
      "Me telling my rubber duck about the bug I just fixed.",
      "When someone asks if I can help them with their printer.",
      "My brain after staring at my screen for 10 hours straight.",
      "When the client says they want a 'small change'."
    ],
    sarcastic: [
      "Oh sure, let me just quickly learn quantum physics while I'm waiting for this npm install.",
      "My face when someone says 'it should be an easy fix'.",
      "Wow, another Stack Overflow solution that's only 5 years outdated.",
      "Yeah, I totally meant to write that bug. It's a feature now.",
      "No need to test it, I'm sure it works perfectly in production.",
      "What do you mean you don't understand my code? I wrote it 20 minutes ago and I don't understand it either.",
      "Sure, I'd love to join another meeting that could have been an email.",
      "Me pretending to know what I'm doing in a technical interview."
    ],
    motivational: [
      "Code like nobody's watching your GitHub commits.",
      "Every expert was once a beginner. Keep pushing forward.",
      "Bugs are just opportunities for improvement in disguise.",
      "Dream in code. Build with passion. Debug with patience.",
      "The best error message is the one that never shows up.",
      "Your code is not just lines, it's your legacy.",
      "The road to great software is paved with small, consistent improvements.",
      "The only way to learn programming is by programming."
    ],
    dark: [
      "My code doesn't have bugs. It develops random unexpected features.",
      "The only thing darker than this meme is my code without comments.",
      "I told them I'd fix the bug. I never said when.",
      "How my soul looks after looking at legacy code.",
      "When you realize you've been debugging for hours and the issue was a missing semicolon.",
      "My mental state after working with CSS for 8 hours straight.",
      "Everyone's reaction when I suggest we rewrite the entire codebase.",
      "Coffee's wearing off but the bugs aren't going away."
    ],
    tech: [
      "AI doesn't need to take our jobs, most of us just copy-paste from Stack Overflow anyway.",
      "What 'blockchain technology' sounds like to non-tech people.",
      "How I imagine my computer feels when I have 50 browser tabs open.",
      "The face my computer makes when I try to run my machine learning model locally.",
      "This is what peak performance looks like. You may not like it, but this is what 100% CPU usage gets you.",
      "POV: You're explaining NFTs to your grandparents.",
      "My face when I realize I've been hired to maintain a codebase written entirely in COBOL.",
      "When the AI generates better code than you do."
    ],
    techjokes: [
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "Eight bytes walk into a bar, the bartender asks 'What can I get you?' One of them says, 'Make us a double.'",
      "A SQL query walks into a bar, walks up to two tables, and asks, 'May I join you?'",
      "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves.",
      "Why did the developer go broke? Because they used up all their cache.",
      "Why don't programmers like nature? It has too many bugs and no debugging tool.",
      "A programmer's wife tells him, 'Go to the store and get a gallon of milk. If they have eggs, get a dozen.' He returns with 12 gallons of milk.",
      "There are 10 types of people in the world: those who understand binary, and those who don't."
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
