import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { listPublishedPosts } from "@/lib/notion";

const links = {
  Product: [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/use-cases", label: "Use cases" },
  ],
} as const;

const RECENT_POST_LIMIT = 4;

export async function MarketingFooter() {
  const posts = await listPublishedPosts();
  const recent = posts.slice(0, RECENT_POST_LIMIT);

  return (
    <footer className="border-t border-border/60 bg-muted/20 px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <p className="text-lg text-foreground">
            <BrandWordmark />
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Next.js boilerplate — structured so you can move fast without rewiring fundamentals.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(links) as (keyof typeof links)[]).map((group) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {links[group].map(({ href, label }) => (
                  <li key={`${group}-${href}`}>
                    <Link
                      href={href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Posts
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/blog"
                  className="font-medium text-foreground transition-colors hover:underline"
                >
                  All posts
                </Link>
              </li>
              {recent.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="line-clamp-2 text-muted-foreground transition-colors hover:text-foreground"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-border/60 pt-8 text-center text-xs text-muted-foreground">
        Replace this footer with your company links, legal, and status. Template ©{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
