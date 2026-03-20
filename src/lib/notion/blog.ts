import { isFullDatabase, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import {
  getNotionBlogDatabaseId,
  getNotionClient,
  isNotionConfigured,
} from "@/lib/notion/client";
import { markdownToPlainExcerpt } from "@/lib/blog/markdown-excerpt";
import {
  type BlogPostListItem,
  parseBlogPostListItem,
} from "@/lib/notion/props";

export type { BlogPostListItem } from "@/lib/notion/props";

/** Index cards: metadata plus a plain-text preview from the post body. */
export type BlogPostCardItem = BlogPostListItem & {
  bodyExcerpt: string;
};

export interface BlogPostDetail extends BlogPostListItem {
  markdown: string;
}

let cachedDataSourceId: string | null = null;

/**
 * Notion API 2025+ queries rows via `dataSources.query` using the data source
 * id from `databases.retrieve`, not `databases.query` (removed from the client).
 */
async function getBlogDataSourceId(): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;
  const notion = getNotionClient();
  const databaseId = getNotionBlogDatabaseId();
  const db = await notion.databases.retrieve({ database_id: databaseId });
  if (!isFullDatabase(db)) {
    throw new Error("Notion database response incomplete");
  }
  const first = db.data_sources[0];
  if (!first) {
    throw new Error("Notion database has no data sources");
  }
  cachedDataSourceId = first.id;
  return cachedDataSourceId;
}

async function queryAllPublishedPages(): Promise<PageObjectResponse[]> {
  const notion = getNotionClient();
  const dataSourceId = await getBlogDataSourceId();
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      result_type: "page",
      filter: {
        property: "Published",
        type: "checkbox",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
      start_cursor: cursor,
      page_size: 100,
    });
    for (const row of res.results) {
      if (isFullPage(row)) results.push(row);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results;
}

/** Published posts for the index, newest first. Empty if Notion is not configured. */
export async function listPublishedPosts(): Promise<BlogPostListItem[]> {
  if (!isNotionConfigured()) return [];

  try {
    const pages = await queryAllPublishedPages();
    const items: BlogPostListItem[] = [];
    for (const page of pages) {
      const row = parseBlogPostListItem(page);
      if (row) items.push(row);
    }
    return items;
  } catch {
    return [];
  }
}

/**
 * Same as {@link listPublishedPosts} but fetches each page’s Markdown and derives a short
 * plain-text excerpt for cards (parallel requests).
 */
export async function listPublishedPostsWithPreviews(): Promise<
  BlogPostCardItem[]
> {
  const posts = await listPublishedPosts();
  if (posts.length === 0) return [];

  const enriched = await Promise.all(
    posts.map(async (post) => {
      try {
        const md = await getPageMarkdown(post.id);
        let bodyExcerpt = markdownToPlainExcerpt(md);
        if (!bodyExcerpt && post.summary) {
          bodyExcerpt = post.summary;
        }
        return { ...post, bodyExcerpt };
      } catch {
        return {
          ...post,
          bodyExcerpt: post.summary ? post.summary : "",
        };
      }
    }),
  );

  return enriched;
}

/** Slugs for `generateStaticParams` — empty when not configured or on error. */
export async function listPublishedSlugs(): Promise<string[]> {
  const posts = await listPublishedPosts();
  return posts.map((p) => p.slug);
}

/**
 * Published post matching `slug`, or `null` if missing / Notion error / not configured.
 */
export async function getPostBySlug(
  slug: string,
): Promise<BlogPostDetail | null> {
  if (!isNotionConfigured()) return null;

  try {
    const notion = getNotionClient();
    const dataSourceId = await getBlogDataSourceId();
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      result_type: "page",
      filter: {
        and: [
          {
            property: "Published",
            type: "checkbox",
            checkbox: { equals: true },
          },
          {
            property: "Slug",
            type: "rich_text",
            rich_text: { equals: slug },
          },
        ],
      },
      page_size: 10,
    });

    const page = res.results.find(isFullPage);
    if (!page) return null;

    const meta = parseBlogPostListItem(page);
    if (!meta) return null;

    const markdown = await getPageMarkdown(page.id);
    return { ...meta, markdown };
  } catch {
    return null;
  }
}

export async function getPageMarkdown(pageId: string): Promise<string> {
  const notion = getNotionClient();
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const blocks = await n2m.pageToMarkdown(pageId);
  const strings = n2m.toMarkdownString(blocks);
  return strings.parent?.trim() ?? "";
}
