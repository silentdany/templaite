# Open Graph images (`next/og`)

## Shared template

- **Builder**: [`src/lib/og/template.tsx`](../src/lib/og/template.tsx) — `await createOgImageResponse(props)` (loads **Syne** Latin `.woff` files from [`@fontsource/syne`](../package.json) via [`src/lib/og/fonts.ts`](../src/lib/og/fonts.ts), same family as the marketing layout).
- **Types**: [`src/lib/og/types.ts`](../src/lib/og/types.ts) — `OgImageTemplateProps` (`title`, `subtitle`, `kind`, `siteName`, `alt`)
- **Visuals**: Same **grid + soft gradients** language as the marketing hero ([`hero-section.tsx`](../src/components/marketing/sections/hero-section.tsx)) and the **wordmark** aligned with [`BrandWordmark`](../src/components/brand-wordmark.tsx) (`templ` + `ai` pill + `te`).

## Default (site root)

- [`src/app/opengraph-image.tsx`](../src/app/opengraph-image.tsx) / [`twitter-image.tsx`](../src/app/twitter-image.tsx) use [`createDefaultOgImage`](../src/lib/og-image.tsx).

## Segment examples

- **Blog (index)**: [`src/app/blog/opengraph-image.tsx`](../src/app/blog/opengraph-image.tsx) / [`twitter-image.tsx`](../src/app/blog/twitter-image.tsx).
- **Blog (post)**: [`src/app/blog/[slug]/opengraph-image.tsx`](../src/app/blog/[slug]/opengraph-image.tsx) / [`twitter-image.tsx`](../src/app/blog/[slug]/twitter-image.tsx) — post title from Notion. **Do not** add `generateImageMetadata` with a single `id` unless you also reference `/blog/[slug]/opengraph-image/{id}` in metadata; otherwise the share URL stays `/blog/[slug]/opengraph-image`.
- **Use cases**: [`src/app/use-cases/opengraph-image.tsx`](../src/app/use-cases/opengraph-image.tsx)

## Dynamic route (e.g. blog post)

`app/blog/[slug]/opengraph-image.tsx` is implemented; for other segments, use the same pattern:

```tsx
import { createOgImageResponse } from "@/lib/og";
import { OG_IMAGE_SIZE } from "@/lib/site-metadata";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " "); // or fetch post title

  return await createOgImageResponse({
    alt: `Article: ${title}`,
    kind: "Blog",
    title,
    subtitle: "Templaite — notes from the stack.",
    siteName: "Templaite",
  });
}
```

Export `alt` if static; for fully dynamic alt, use [`generateImageMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) from the Next.js docs.

## Metadata

Set `metadataBase` in [`src/app/layout.tsx`](../src/app/layout.tsx) via `NEXT_PUBLIC_APP_URL` so OG URLs resolve in production.
