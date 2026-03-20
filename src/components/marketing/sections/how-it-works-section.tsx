import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Clone and env",
    body: "Copy `.env.example`, connect Postgres, and run Prisma generate—AGENTS.md lists the exact commands.",
  },
  {
    step: "02",
    title: "Turn on providers",
    body: "Add Polar, Resend, Google, or AI keys when you need them; bootstrap and playground pages show what’s live.",
  },
  {
    step: "03",
    title: "Build your surface",
    body: "Keep using RSC-first pages, colocate client panels, and follow the existing API patterns for new routes.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-border/60 bg-muted/20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={cn(
              "text-3xl font-semibold tracking-tight sm:text-4xl",
              "[font-family:var(--font-marketing-heading)]",
            )}
          >
            From zero to deployed in three beats
          </h2>
          <p className="mt-4 text-muted-foreground">
            No twenty-step tutorial—just a repo that already matches production
            constraints.
          </p>
        </div>
        <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map(({ step, title, body }) => (
            <li key={step} className="relative">
              <span className="text-5xl font-semibold tabular-nums text-border [font-family:var(--font-marketing-heading)]">
                {step}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
