/**
 * Props for generated Open Graph / Twitter images (`next/og` + `ImageResponse`).
 * Use for home, blog posts, use cases, or any route-level `opengraph-image.tsx`.
 */
export interface OgImageTemplateProps {
  /** Primary headline (keep concise; long strings are truncated). */
  title: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Small label above the title (e.g. "Blog", "Use case"). */
  kind?: string;
  /** Footer label; defaults to site name from `site-metadata`. */
  siteName?: string;
  /** Alt text for `<meta property="og:image:alt" />`. */
  alt: string;
}
