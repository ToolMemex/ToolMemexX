// src/lib/storage.ts

export interface Meme {
  id: string;
  url: string;
  title?: string;
  createdAt: string;
}

const STORAGE_KEY = "saved-memes-v1";

let cache: Meme[] | null = null;

const isBrowser = typeof window !== "undefined";
const safeLocalStorage = isBrowser ? window.localStorage : null;

function readFromStorage(): Meme[] {
  if (!safeLocalStorage) return [];

  try {
    const raw = safeLocalStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item) => typeof item.id === "string" && typeof item.url === "string"
      ) as Meme[];
    }
    return [];
  } catch (err) {
    console.error("Failed to parse memes from storage", err);
    return [];
  }
}

function writeToStorage(memes: Meme[]) {
  if (!safeLocalStorage) return;
  try {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(memes));
  } catch (err) {
    console.error("Failed to write memes to storage", err);
  }
}

export const storage = {
  getAll(): Meme[] {
    if (cache) return cache;
    const memes = readFromStorage();
    cache = memes;
    return memes;
  },

  save(meme: Meme) {
    const memes = storage.getAll();
    const exists = memes.find((m) => m.id === meme.id);

    if (!exists) {
      const updated = [meme, ...memes];
      writeToStorage(updated);
      cache = updated;
    }
  },

  delete(id: string) {
    const memes = storage.getAll().filter((m) => m.id !== id);
    writeToStorage(memes);
    cache = memes;
  },

  clear() {
    writeToStorage([]);
    cache = [];
  },

  refresh() {
    // Useful if you need to manually re-sync cache
    cache = null;
  },

  count(): number {
    return storage.getAll().length;
  }
};