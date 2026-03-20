# Notion blog

The blog at `/blog` reads posts from a **Notion database** using [`@notionhq/client`](https://github.com/makenotion/notion-sdk-js) and renders page bodies as Markdown via [`notion-to-md`](https://github.com/souvikinator/notion-to-md) + [`react-markdown`](https://github.com/remarkjs/react-markdown).

## Setup checklist

1. **Create an integration** at [notion.so/my-integrations](https://www.notion.so/my-integrations) and copy the **Internal Integration Secret**.
2. **Create a database** (full page or inline) with the properties below.
3. In Notion, open the database → **⋯** → **Connections** (or **Add connections**) and connect your integration.
4. Copy the **database ID** from the Notion URL:  
   `https://www.notion.so/{workspace}/{DATABASE_ID}?v=...`  
   `DATABASE_ID` is 32 hex characters, with or without hyphens.
5. Set env vars (see [`.env.example`](../.env.example)):

   - `NOTION_TOKEN` — integration secret  
   - `NOTION_BLOG_DATABASE_ID` — database id  

6. Restart `pnpm dev`. Published rows should appear on `/blog` and at `/blog/[slug]`.

## Canonical database schema

| Property    | Type        | Notes                                      |
| ----------- | ----------- | ------------------------------------------ |
| `Title`     | Title       | Post title                                 |
| `Slug`      | Rich text   | URL segment, e.g. `my-first-post` (unique) |
| `Published` | Checkbox  | Must be checked for public posts           |
| `Date`      | Date        | Shown on index and post; used for sort     |
| `Summary`   | Rich text   | Optional excerpt; OG subtitle              |

Property **names** must match exactly (including capitalization).

## Code map

| Area | Location |
|------|----------|
| Notion client + env | [`src/lib/notion/client.ts`](../src/lib/notion/client.ts) |
| Property parsing + row mapping | [`src/lib/notion/props.ts`](../src/lib/notion/props.ts) |
| List posts, slug lookup, Markdown | [`src/lib/notion/blog.ts`](../src/lib/notion/blog.ts) |
| Blog index + post layout | [`src/app/blog/page.tsx`](../src/app/blog/page.tsx), [`src/app/blog/[slug]/page.tsx`](../src/app/blog/[slug]/page.tsx) |
| Markdown rendering | [`src/components/blog/post-body.tsx`](../src/components/blog/post-body.tsx) |

## Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| **403** from Notion | Integration not connected to the database or page |
| **Empty list** with env set | No rows with `Published` checked, or `Title` / `Slug` missing |
| **404** on a slug | Wrong slug, row not published, or duplicate `Slug` values (first match wins) |
| **Build passes but no posts** | Invalid `NOTION_BLOG_DATABASE_ID` — double-check the id from the URL |

The Notion API version bundled with this repo queries rows via **`dataSources.query`** (after resolving the database’s data source via `databases.retrieve`). You need a **Notion database** the integration can access—not only a standalone page.

## ISR

Post pages use `revalidate = 300` (5 minutes). New or updated posts appear after revalidation or the next deploy. For instant updates, add an optional `POST /api/revalidate` (secret header) and call it from a webhook or automation.
