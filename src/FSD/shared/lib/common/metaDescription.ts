const DEFAULT_MAX_PLAIN_LENGTH = 120;

/** Sentence-ending punctuation (Latin and common Cyrillic-style closers). */
const SENTENCE_END_PATTERN = /[.!?…](?:\s+|$)/g;

/**
 * Removes common Markdown syntax and normalizes whitespace to plain text.
 */
export function stripMarkdownForPlainText(markdown: string): string {
  if (!markdown.trim()) {
    return "";
  }

  let text = markdown;

  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/`[^`\n]+`/g, " ");
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, " ");
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  text = text.replace(/_([^_]+)_/g, "$1");
  text = text.replace(/^[-*_]{3,}\s*$/gm, " ");
  text = text.replace(/^>\s+/gm, "");
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Shortens text at the last full sentence that fits within maxLength.
 * Falls back to the last word boundary, then a hard cut with an ellipsis.
 */
export function truncateAtSentenceBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const slice = text.slice(0, maxLength);
  let lastSentenceEnd = -1;

  for (const match of slice.matchAll(SENTENCE_END_PATTERN)) {
    lastSentenceEnd = match.index !== undefined ? match.index + 1 : lastSentenceEnd;
  }

  const minUsefulLength = Math.floor(maxLength * 0.4);
  if (lastSentenceEnd >= minUsefulLength) {
    return slice.slice(0, lastSentenceEnd).trim();
  }

  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace >= minUsefulLength) {
    return `${slice.slice(0, lastSpace).trim()}…`;
  }

  return `${slice.trim()}…`;
}

/**
 * Builds a meta description from album markdown plus site tagline.
 */
export function buildAlbumMetaDescription(
  markdownDescription: string,
  siteTagline: string,
  maxPlainLength: number = DEFAULT_MAX_PLAIN_LENGTH
): string {
  const plain = stripMarkdownForPlainText(markdownDescription);
  const summary = truncateAtSentenceBoundary(plain, maxPlainLength);

  if (!summary) {
    return siteTagline;
  }

  return `${summary} | ${siteTagline}`;
}
