// client/src/main.tsx or index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { FontSizeProvider, useFontSize } from "./contexts/FontSizeContext";

// Custom component to apply the font size globally
function GlobalFontSizeWrapper() {
  const { fontSize } = useFontSize();

  React.useEffect(() => {
    document.body.classList.remove("text-sm", "text-base", "text-lg");
    if (fontSize === "small") {
      document.body.classList.add("text-sm");
    } else if (fontSize === "large") {
      document.body.classList.add("text-lg");
    } else {
      document.body.classList.add("text-base");
    }
  }, [fontSize]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FontSizeProvider>
      <GlobalFontSizeWrapper />
    </FontSizeProvider>
  </React.StrictMode>
);