import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/blog/post-body";
import { MarketingFooter } from "@/components/marketing/sections/marketing-footer";
import { cn } from "@/lib/utils";
import { formatPostDate } from "@/lib/blog/format-post-date";
import { markdownToPlainExcerpt } from "@/lib/blog/markdown-excerpt";
import {
  getPostBySlug,
  listPublishedSlugs,
} from "@/lib/notion";
import {
  getMetadataBaseUrl,
  OG_IMAGE_SIZE,
  SITE_NAME,
} from "@/lib/site-metadata";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Post" };
  }

  const base = getMetadataBaseUrl();
  const path = `/blog/${slug}`;
  const canonicalUrl = new URL(path, base).href;

  const description =
    post.summary.trim() ||
    markdownToPlainExcerpt(post.markdown, 165) ||
    undefined;

  const publishedTime =
    post.date && !Number.isNaN(Date.parse(post.date))
      ? new Date(post.date).toISOString()
      : undefined;

  const ogImageUrl = `${path}/opengraph-image`;
  const twitterImageUrl = `${path}/twitter-image`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: path,
    },
    authors: [{ name: SITE_NAME, url: base.href }],
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      url: canonicalUrl,
      title: post.title,
      description,
      publishedTime,
      ...(publishedTime ? { modifiedTime: publishedTime } : {}),
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: post.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [
        {
          url: twitterImageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: post.title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <article className="mx-auto w-full max-w-3xl flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="transition hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-border">
              /
            </li>
            <li>
              <Link href="/blog" className="transition hover:text-foreground">
                Blog
              </Link>
            </li>
          </ol>
        </nav>
        <header className="border-b border-border/80 pb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {SITE_NAME}
          </p>
          <time
            className="mt-3 block text-sm text-muted-foreground"
            dateTime={post.date ?? undefined}
          >
            {formatPostDate(post.date) || "—"}
          </time>
          <h1
            className={cn(
              "mt-4 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl",
              "[font-family:var(--font-marketing-heading)]",
            )}
          >
            {post.title}
          </h1>
          {post.summary ? (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {post.summary}
            </p>
          ) : null}
        </header>
        <div className="pt-10">
          <PostBody markdown={post.markdown} />
        </div>
      </article>
      <MarketingFooter />
    </>
  );
}
