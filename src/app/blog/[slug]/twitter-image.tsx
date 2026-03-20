import { createOgImageResponse } from "@/lib/og";
import { getPostBySlug } from "@/lib/notion";
import { OG_IMAGE_SIZE, SITE_NAME } from "@/lib/site-metadata";

/** See `opengraph-image.tsx` — avoid `generateImageMetadata` here so the URL stays `/twitter-image` without an extra id segment. */
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createOgImageResponse({
      alt: "Post not found",
      kind: "Blog",
      title: "Post not found",
      siteName: SITE_NAME,
    });
  }

  return createOgImageResponse({
    alt: post.title,
    kind: "Blog",
    title: post.title,
    subtitle: post.summary || undefined,
    siteName: SITE_NAME,
  });
}
