import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-primary/15 via-card to-muted/40 px-8 py-16 text-center shadow-xl shadow-primary/10 sm:px-16 sm:py-20">
        <h2
          className={cn(
            "text-3xl font-semibold tracking-tight sm:text-4xl",
            "[font-family:var(--font-marketing-heading)]",
          )}
        >
          Ship the thing you actually want to build
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Auth, database, billing hooks, and AI are wired. Spend your next sprint
          on product—not plumbing.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button
            nativeButton={false}
            size="lg"
            className="gap-2 rounded-xl px-8"
            render={<Link href="/signup" />}
          >
            Get started free
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            size="lg"
            className="rounded-xl border-border/80 bg-background/70 backdrop-blur-sm"
            render={<Link href="/login" />}
          >
            Log in
          </Button>
        </div>
      </div>
    </section>
  );
}
