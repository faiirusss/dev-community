import { usePostStats } from "../hooks/usePostStats";

export function PostStats({ content }: { content: string }) {
  const { wordCount, readingTime } = usePostStats(content);

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>~{readingTime} min read</span>
      <span>{wordCount} words</span>
    </div>
  );
}