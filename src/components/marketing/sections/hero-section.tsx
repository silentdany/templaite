import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:pt-28",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.65]"
        aria-hidden
      >
        <div className="absolute -left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.18_260/0.35)_0%,transparent_65%)] blur-3xl sm:h-[520px] sm:w-[520px]" />
        <div className="absolute -right-1/4 bottom-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.6_0.14_30/0.22)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.145_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.145_0_0/0.04)_1px,transparent_1px)] bg-size-[64px_64px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="size-3.5 text-foreground/70" aria-hidden />
            Ship faster with auth, billing, and AI in one stack
          </div>
          <h1
            className={cn(
              "text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl",
              "[font-family:var(--font-marketing-heading)]",
            )}
          >
            The boilerplate that still looks like{" "}
            <span className="bg-linear-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              your product
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Next.js 16, Better Auth, Prisma, Polar, shadcn/ui, and the AI SDK—wired so
            you can focus on the idea, not the integration crossword.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button
              nativeButton={false}
              size="lg"
              className="gap-2 rounded-xl px-6 shadow-md shadow-foreground/10"
              render={<Link href="/signup" />}
            >
              Start building
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              size="lg"
              className="rounded-xl border-border/80 bg-background/60 backdrop-blur-sm"
              render={<Link href="#features" />}
            >
              Explore features
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="relative rounded-2xl border border-border/70 bg-card/80 p-1 shadow-2xl shadow-foreground/5 backdrop-blur-md">
            <div className="overflow-hidden rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-destructive/80" />
                <span className="size-2.5 rounded-full bg-[oklch(0.75_0.15_85/0.9)]" />
                <span className="size-2.5 rounded-full bg-primary/40" />
                <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                  src/app/(app)/dashboard — Templaite
                </span>
              </div>
              <pre className="max-h-[220px] overflow-auto p-4 text-left text-[11px] leading-relaxed text-muted-foreground sm:max-h-none sm:text-xs">
                <code>
                  {`// One stack. Sensible defaults.\n`}
                  <span className="text-foreground/80">{`import { auth } from "@/lib/auth";\n`}</span>
                  <span className="text-muted-foreground">{`import { prisma } from "@/lib/prisma";\n\n`}</span>
                  <span className="text-foreground/60">{`export async function GET() {\n`}</span>
                  <span className="text-foreground/60">{`  const session = await auth.api.getSession({ headers });\n`}</span>
                  <span className="text-foreground/60">{`  if (!session) return unauthorized();\n`}</span>
                  <span className="text-foreground/60">{`  return json(await prisma.user.findMany());\n`}</span>
                  <span className="text-foreground/60">{`}`}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
