import { getMetadataBaseUrl } from "@/lib/site-metadata";

/** Absolute URL for a path (e.g. `/blog` → `https://example.com/blog`). */
export function absoluteUrl(path: string): string {
  const base = getMetadataBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, base).href;
}
