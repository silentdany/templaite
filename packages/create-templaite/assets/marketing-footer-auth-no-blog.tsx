import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";

const links = {
  Product: [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/playground", label: "Playground" },
    { href: "/use-cases", label: "Use cases" },
  ],
  Account: [
    { href: "/login", label: "Log in" },
    { href: "/signup", label: "Sign up" },
    { href: "/billing", label: "Billing" },
  ],
  Docs: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/chat", label: "Chat" },
  ],
} as const;

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
        <div>
          <p className="text-lg text-foreground">
            <BrandWordmark />
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Next.js boilerplate with auth, Postgres, optional Polar, and AI—structured
            so you can move fast without rewiring fundamentals.
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
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-border/60 pt-8 text-center text-xs text-muted-foreground">
        Replace this footer with your company links, legal, and status. Template ©{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
}
