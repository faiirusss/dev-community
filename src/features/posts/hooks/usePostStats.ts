import { useMemo } from "react";

export function usePostStats(content: string): {
  wordCount: number;
  charCount: number;
  readingTime: number;
} {
  const stats = useMemo(() => {
    if (!content) {
      return { wordCount: 0, charCount: 0, readingTime: 0 };
    }

    const words = content.split(/\s+/).filter((word) => word.length > 0);
    const wordCount = words.length;
    const charCount = content.length;
    const readingTime = Math.ceil(wordCount / 200);

    return { wordCount, charCount, readingTime };
  }, [content]);

  return stats;
}