import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "Patterns for shipping with Templaite: auth, Postgres, Polar, and AI in one stack.",
  openGraph: {
    title: `Use cases · ${SITE_NAME}`,
    description:
      "Patterns for shipping with Templaite: auth, Postgres, Polar, and AI in one stack.",
    images: [
      {
        url: "/use-cases/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Use cases",
      },
    ],
  },
};

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm font-medium text-muted-foreground">Use cases</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Coming soon</h1>
      <p className="mt-3 text-muted-foreground">
        Placeholder route with segment-level OG images. See{" "}
        <code className="text-xs">docs/OG_IMAGES.md</code> for dynamic examples.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        <Link href="/" className="text-foreground underline-offset-4 hover:underline">
          ← Home
        </Link>
      </p>
    </div>
  );
}
