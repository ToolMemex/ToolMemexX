// client/src/hooks/useSEO.ts
import { useEffect } from "react";

export const useSEO = (title: string, description?: string) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      const metaDescription = document.querySelector(
        "meta[name='description']"
      ) as HTMLMetaElement | null;

      if (metaDescription) {
        metaDescription.content = description;
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);
};