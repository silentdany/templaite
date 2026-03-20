import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/sections/marketing-footer";
import { formatPostDate } from "@/lib/blog/format-post-date";
import { cn } from "@/lib/utils";
import {
  isNotionConfigured,
  listPublishedPostsWithPreviews,
} from "@/lib/notion";
import { SITE_NAME } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and notes for the Templaite stack: auth, database, billing, and AI.",
  openGraph: {
    title: `Blog · ${SITE_NAME}`,
    description:
      "Guides and notes for the Templaite stack: auth, database, billing, and AI.",
    images: [
      { url: "/blog/opengraph-image", width: 1200, height: 630, alt: "Blog" },
    ],
  },
};

export default async function BlogIndexPage() {
  const configured = isNotionConfigured();
  const posts = configured ? await listPublishedPostsWithPreviews() : [];

  return (
    <>
      <section
        className={cn(
          "relative isolate overflow-hidden border-b border-border/40 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.65]"
          aria-hidden
        >
          <div className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.18_260/0.35)_0%,transparent_65%)] blur-3xl sm:h-[520px] sm:w-[520px]" />
          <div className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.6_0.14_30/0.22)_0%,transparent_65%)] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.145_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.145_0_0/0.04)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <BookOpen className="size-3.5 text-foreground/70" aria-hidden />
              Guides &amp; notes from the stack
            </div>
            <h1
              className={cn(
                "text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl",
                "[font-family:var(--font-marketing-heading)]",
              )}
            >
              Blog
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Better Auth, Prisma, Polar, and the AI SDK—patterns you can copy into your
              own product.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        {!configured ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground shadow-sm">
            <p className="font-medium text-foreground">Blog is not connected</p>
            <p className="mt-3 leading-relaxed">
              Set{" "}
              <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                NOTION_TOKEN
              </code>{" "}
              and{" "}
              <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                NOTION_BLOG_DATABASE_ID
              </code>{" "}
              in your environment, then share the database with your Notion integration.
              See{" "}
              <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                docs/BLOG_NOTION.md
              </code>
              .
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-border/80 bg-card/50 p-10 text-center">
            <p className="text-muted-foreground">
              No published posts yet. In Notion, add rows with{" "}
              <span className="font-medium text-foreground">Published</span> checked.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm transition",
                    "hover:border-border hover:bg-card hover:shadow-md",
                  )}
                >
                  <time
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    dateTime={post.date ?? undefined}
                  >
                    {formatPostDate(post.date) || "—"}
                  </time>
                  <h2
                    className={cn(
                      "mt-3 text-xl font-semibold tracking-tight text-foreground transition group-hover:text-primary",
                      "[font-family:var(--font-marketing-heading)]",
                    )}
                  >
                    {post.title}
                  </h2>
                  <p
                    className={cn(
                      "mt-3 flex-1 text-sm leading-relaxed text-muted-foreground",
                      "line-clamp-6 min-h-18",
                    )}
                  >
                    {(() => {
                      const fromBody = post.bodyExcerpt.trim();
                      if (fromBody) return fromBody;
                      const fromSummary = post.summary.trim();
                      if (fromSummary) return fromSummary;
                      return "Open the post to read the full article.";
                    })()}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read post
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <MarketingFooter />
    </>
  );
}
