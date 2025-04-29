// src/contexts/FontSizeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";

interface FontSizeContextProps {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextProps>({
  fontSize: "medium",
  setFontSize: () => {},
});

export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(
    (localStorage.getItem("fontSize") as FontSize) || "medium"
  );

  useEffect(() => {
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add(`font-${fontSize}`);
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => useContext(FontSizeContext);