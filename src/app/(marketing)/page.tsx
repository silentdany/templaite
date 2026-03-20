import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="max-w-lg text-center space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Templaite</h1>
        <p className="text-muted-foreground">
          Next.js boilerplate with Better Auth, Prisma, Polar, and the AI SDK.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/signup" />}>
          Sign up
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/login" />}>
          Log in
        </Button>
        <Button variant="secondary" nativeButton={false} render={<Link href="/dashboard" />}>
          Dashboard
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/playground" />}>
          Playground
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-md">
        Playground, Account, and Billing require a session— you will be redirected
        through login if needed.
      </p>
    </div>
  );
}
