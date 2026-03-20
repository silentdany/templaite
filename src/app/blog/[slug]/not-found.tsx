import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/sections/marketing-footer";

export default function BlogPostNotFound() {
  return (
    <>
      <div className="mx-auto max-w-3xl flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
        <h1 className="text-2xl font-semibold tracking-tight [font-family:var(--font-marketing-heading)]">
          Post not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          That slug does not match a published post, or Notion could not be reached.
        </p>
        <p className="mt-8 text-sm">
          <Link
            href="/blog"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to blog
          </Link>
        </p>
      </div>
      <MarketingFooter />
    </>
  );
}
