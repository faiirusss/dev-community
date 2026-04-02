import React from "react";
import { EmbedRenderer } from "./EmbedRenderer";
import { EMBED_PATTERN } from "~/lib/markdown/embed";

interface PostPreviewProps {
  title: string;
  content: string;
  coverImage?: string;
  tags?: string[];
}

/**
 * Extract URL from embed syntax: {% embed URL %}
 */
function extractUrlFromEmbed(embedMatch: string): string {
  const match = embedMatch.match(EMBED_PATTERN);
  return match ? match[1] : "";
}

/**
 * Simple markdown-like rendering for preview
 * Handles basic formatting: headers, bold, italic, code, links
 */
function renderSimpleMarkdown(text: string): string {
  let html = text;

  // Escape HTML first
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers (h1-h6)
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<h") && !html.startsWith("<p>")) {
    html = `<p>${html}</p>`;
  }

  return html;
}

export function PostPreview({
  title,
  content,
  coverImage,
  tags,
}: PostPreviewProps) {
  const renderContent = () => {
    const parts = content.split(EMBED_PATTERN);
    const matches = content.match(EMBED_PATTERN);

    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part.trim() && (
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: renderSimpleMarkdown(part),
            }}
          />
        )}
        {matches?.[index] && (
          <EmbedRenderer url={extractUrlFromEmbed(matches[index])} />
        )}
      </React.Fragment>
    ));
  };

  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      {coverImage && (
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 not-prose">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-8">{renderContent()}</div>
    </article>
  );
}
