import { Client } from "@notionhq/client";

let client: Client | null = null;

export function isNotionConfigured(): boolean {
  return Boolean(
    process.env.NOTION_TOKEN?.trim() &&
      process.env.NOTION_BLOG_DATABASE_ID?.trim(),
  );
}

/** Database ID as in Notion (hyphens optional; API accepts standard UUID strings). */
export function getNotionBlogDatabaseId(): string {
  return process.env.NOTION_BLOG_DATABASE_ID?.trim() ?? "";
}

export function getNotionClient(): Client {
  if (!isNotionConfigured()) {
    throw new Error(
      "Notion is not configured (set NOTION_TOKEN and NOTION_BLOG_DATABASE_ID)",
    );
  }
  if (!client) {
    client = new Client({ auth: process.env.NOTION_TOKEN });
  }
  return client;
}
