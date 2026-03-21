import type { TemplaiteFeatures } from "./features.js";

export function buildAppLayoutTs(f: TemplaiteFeatures): string {
  const nav: { href: string; label: string }[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/playground", label: "Playground" },
    { href: "/account", label: "Account" },
  ];
  if (f.payments) nav.push({ href: "/billing", label: "Billing" });
  if (f.aiChat) nav.push({ href: "/chat", label: "Chat" });

  const navBlock = nav
    .map(
      (item) => `            <Link
              href="${item.href}"
              className="text-muted-foreground hover:text-foreground"
            >
              ${item.label}
            </Link>`,
    )
    .join("\n");

  return `import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppUserMenu } from "./app-user-menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="shrink-0" aria-label="Templaite home">
            <BrandWordmark className="text-sm sm:text-base" />
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
${navBlock}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <AppUserMenu />
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
`;
}
