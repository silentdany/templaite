import type { PageObjectResponse } from "@notionhq/client";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { z } from "zod";

/** Canonical Notion database column names — must match your database. */
export const NOTION_BLOG_SCHEMA = {
  title: "Title",
  slug: "Slug",
  published: "Published",
  date: "Date",
  summary: "Summary",
} as const;

function richTextPlain(items: RichTextItemResponse[]): string {
  return items.map((t) => t.plain_text).join("");
}

const blogPostListSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().nullable(),
  summary: z.string(),
});

export type BlogPostListItem = z.infer<typeof blogPostListSchema>;

/**
 * Maps a full Notion page row to list metadata. Returns `null` if required fields are missing.
 */
export function parseBlogPostListItem(
  page: PageObjectResponse,
): BlogPostListItem | null {
  const { properties } = page;
  const titleProp = properties[NOTION_BLOG_SCHEMA.title];
  const slugProp = properties[NOTION_BLOG_SCHEMA.slug];
  const dateProp = properties[NOTION_BLOG_SCHEMA.date];
  const summaryProp = properties[NOTION_BLOG_SCHEMA.summary];

  const title =
    titleProp?.type === "title" ? richTextPlain(titleProp.title) : "";
  const slug =
    slugProp?.type === "rich_text" ? richTextPlain(slugProp.rich_text) : "";
  const summary =
    summaryProp?.type === "rich_text"
      ? richTextPlain(summaryProp.rich_text)
      : "";

  let date: string | null = null;
  if (dateProp?.type === "date" && dateProp.date?.start) {
    date = dateProp.date.start;
  }

  const parsed = blogPostListSchema.safeParse({
    id: page.id,
    title: title.trim(),
    slug: slug.trim(),
    date,
    summary: summary.trim(),
  });

  return parsed.success ? parsed.data : null;
}
