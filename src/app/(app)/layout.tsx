import Link from "next/link";
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
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/playground"
              className="text-muted-foreground hover:text-foreground"
            >
              Playground
            </Link>
            <Link
              href="/account"
              className="text-muted-foreground hover:text-foreground"
            >
              Account
            </Link>
            <Link
              href="/billing"
              className="text-muted-foreground hover:text-foreground"
            >
              Billing
            </Link>
            <Link
              href="/chat"
              className="text-muted-foreground hover:text-foreground"
            >
              Chat
            </Link>
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
