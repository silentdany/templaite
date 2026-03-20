# SEO (sitemap, robots, URLs)

## Environment

Set **`NEXT_PUBLIC_APP_URL`** to your production origin (e.g. `https://example.com`) so:

- `metadataBase` in [layout.tsx](../src/app/layout.tsx) resolves OG images and canonicals correctly.
- [absoluteUrl](../src/lib/site-url.ts) in [sitemap.ts](../src/app/sitemap.ts) and [robots.ts](../src/app/robots.ts) emits full `https://…` URLs.

## Files

| File | Role |
|------|------|
| [src/app/sitemap.ts](../src/app/sitemap.ts) | `/`, `/blog`, `/use-cases`, plus Notion blog posts (`revalidate: 300`). |
| [src/app/robots.ts](../src/app/robots.ts) | `Allow: /`, disallow `/api/`, app shell routes, checkout; `Sitemap:` points at `/sitemap.xml`. |

## Crawl rules

Private/product routes are **disallowed** in `robots.txt` (dashboard, account, billing, chat, playground, checkout). They are **not** listed in the sitemap. Adjust [robots.ts](../src/app/robots.ts) if you add new authenticated areas.
