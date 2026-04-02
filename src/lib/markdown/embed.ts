/**
 * Embed URL parser utilities
 * Parses {% embed URL %} syntax in markdown for YouTube, GitHub, Twitter, and CodePen
 */

// Regex to match {% embed URL %} syntax
export const EMBED_PATTERN = /\{%\s*embed\s+(https?:\/\/[^\s]+)\s*%\}/g;

export type EmbedType = "youtube" | "github" | "twitter" | "codepen" | "unknown";

/**
 * Detect the type of embed from a URL
 */
export function detectEmbedType(url: string): EmbedType {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  if (url.includes("gist.github.com")) {
    return "github";
  }
  if (url.includes("twitter.com") || url.includes("x.com")) {
    return "twitter";
  }
  if (url.includes("codepen.io")) {
    return "codepen";
  }
  return "unknown";
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
 */
export function extractYouTubeId(url: string): string | null {
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];

  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];

  return null;
}

/**
 * Extract GitHub Gist ID from gist.github.com URL
 * Pattern: gist.github.com/username/gistid
 */
export function extractGitHubGistId(
  url: string
): { user: string; gistId: string } | null {
  const match = url.match(/gist\.github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return {
      user: match[1],
      gistId: match[2],
    };
  }
  return null;
}

/**
 * Extract Twitter status ID from twitter.com or x.com URL
 * Pattern: twitter.com/username/status/id or x.com/username/status/id
 */
export function extractTwitterId(url: string): string | null {
  const match = url.match(/(?:twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/(\d+)/);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Extract CodePen pen ID from codepen.io URL
 * Pattern: codepen.io/username/pen/penid
 */
export function extractCodePenId(
  url: string
): { user: string; pen: string } | null {
  const match = url.match(/codepen\.io\/([a-zA-Z0-9_-]+)\/pen\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return {
      user: match[1],
      pen: match[2],
    };
  }
  return null;
}