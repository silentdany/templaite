import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and notes for the Templaite stack: auth, database, billing, and AI.",
  openGraph: {
    title: `Blog · ${SITE_NAME}`,
    description:
      "Guides and notes for the Templaite stack: auth, database, billing, and AI.",
    images: [{ url: "/blog/opengraph-image", width: 1200, height: 630, alt: "Blog" }],
  },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm font-medium text-muted-foreground">Blog</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Coming soon</h1>
      <p className="mt-3 text-muted-foreground">
        This route exists as a template: segment-level{" "}
        <code className="text-xs">opengraph-image.tsx</code> and{" "}
        <code className="text-xs">twitter-image.tsx</code> use the shared OG
        builder in <code className="text-xs">src/lib/og/</code>. See{" "}
        <code className="text-xs">docs/OG_IMAGES.md</code> in the repo for
        dynamic routes.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/" className="text-foreground underline-offset-4 hover:underline">
          ← Home
        </Link>
      </p>
    </div>
  );
}
