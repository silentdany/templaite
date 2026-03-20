import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is this production-ready?",
    a: "It is a solid starter: you still own secrets, migrations, rate limits, and compliance. Use the playground and bootstrap routes to verify every integration.",
  },
  {
    q: "Why Better Auth and Polar together?",
    a: "Sessions stay consistent—checkout and portal calls flow through the same authenticated Better Auth client as the rest of your app.",
  },
  {
    q: "Can I remove features I do not need?",
    a: "Yes. Polar, Resend, Google, and AI are optional via env. Strip plugins from auth config and delete routes you do not ship.",
  },
  {
    q: "Where do I change the design?",
    a: "Tokens live in globals.css; UI primitives are shadcn under src/components/ui. Marketing sections are isolated under src/components/marketing/sections.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 border-t border-border/60 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h2
          className={cn(
            "text-center text-3xl font-semibold tracking-tight sm:text-4xl",
            "[font-family:var(--font-marketing-heading)]",
          )}
        >
          FAQ
        </h2>
        <dl className="mt-12 space-y-6">
          {faqs.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-border/70 bg-card/50 p-6 shadow-sm"
            >
              <dt className="font-semibold">{q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
