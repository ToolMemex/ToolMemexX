// client/src/stores/meme-store.ts
import { create } from "zustand";

interface Meme {
  id: string;
  url: string;
  title: string;
}

interface MemeState {
  memes: Meme[];
  setMemes: (memes: Meme[]) => void;
}

export const useMemeStore = create<MemeState>((set) => ({
  memes: [],
  setMemes: (memes) => set({ memes }),
}));