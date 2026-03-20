import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const quotes = [
  {
    text: "We stopped maintaining three templates. Templaite is the one we fork and strip to taste.",
    name: "Alex Rivera",
    role: "Founder, Northline",
  },
  {
    text: "Polar + Better Auth in one pass—our checkout experiment shipped the same week.",
    name: "Sam Okonkwo",
    role: "Engineering Lead, Relaymetrics",
  },
  {
    text: "The playground and bootstrap endpoints saved us from grep-driven development.",
    name: "Jordan Lee",
    role: "Product Engineer, Coil & Key",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="border-t border-border/60 bg-muted/15 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2
          className={cn(
            "mx-auto max-w-xl text-center text-3xl font-semibold tracking-tight sm:text-4xl",
            "[font-family:var(--font-marketing-heading)]",
          )}
        >
          Teams that want boring infra and bold product
        </h2>
        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {quotes.map(({ text, name, role }) => (
            <li
              key={name}
              className="flex flex-col rounded-2xl border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur-sm"
            >
              <Quote
                className="size-8 shrink-0 text-primary/40"
                aria-hidden
              />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                {text}
              </blockquote>
              <footer className="mt-6 border-t border-border/60 pt-4">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{role}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
