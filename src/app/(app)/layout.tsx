import Link from "next/link";
import { AppUserMenu } from "./app-user-menu";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-foreground text-muted-foreground">
            Dashboard
          </Link>
          <Link href="/playground" className="hover:text-foreground text-muted-foreground">
            Playground
          </Link>
          <Link href="/account" className="hover:text-foreground text-muted-foreground">
            Account
          </Link>
          <Link href="/billing" className="hover:text-foreground text-muted-foreground">
            Billing
          </Link>
          <Link href="/chat" className="hover:text-foreground text-muted-foreground">
            Chat
          </Link>
        </nav>
        <AppUserMenu />
      </header>
      <div className="flex flex-1 flex-col min-h-0">{children}</div>
    </div>
  );
}
