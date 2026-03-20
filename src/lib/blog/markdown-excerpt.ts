/**
 * Strip markdown noise and return a short plain-text preview for cards (first paragraph-ish).
 */
export function markdownToPlainExcerpt(
  markdown: string,
  maxChars = 320,
): string {
  const raw = markdown.trim();
  if (!raw) return "";

  const s = raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/<[^>]+>/g, " ");

  const lines = s
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const joined = lines.slice(0, 5).join(" ");
  let out = joined.replace(/\s+/g, " ").trim();

  if (out.length > maxChars) {
    const cut = out.slice(0, maxChars);
    const lastSpace = cut.lastIndexOf(" ");
    out = (lastSpace > 48 ? cut.slice(0, lastSpace) : cut).trim() + "…";
  }

  return out;
}
