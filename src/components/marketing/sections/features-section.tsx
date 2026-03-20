import {
  Bot,
  CreditCard,
  Database,
  LayoutDashboard,
  Lock,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    icon: Lock,
    title: "Auth that scales",
    body: "Email, sessions, and optional OAuth—Better Auth with a Prisma adapter, not a weekend of glue code.",
  },
  {
    icon: Database,
    title: "Prisma 7 + Postgres",
    body: "Pooled runtime URL, direct URL for migrations, and a client ready for server components and route handlers.",
  },
  {
    icon: CreditCard,
    title: "Polar checkout",
    body: "Optional billing plugin: checkout, portal, and customer APIs when you set your Polar token and product.",
  },
  {
    icon: Bot,
    title: "AI SDK wired",
    body: "Streaming chat route with Vercel AI Gateway or OpenAI—env-driven, no secret leakage on status endpoints.",
  },
  {
    icon: Palette,
    title: "shadcn + Tailwind v4",
    body: "Base Nova, neutral tokens, and components you can extend without fighting the design system.",
  },
  {
    icon: LayoutDashboard,
    title: "App shell included",
    body: "Marketing, auth, and signed-in route groups with middleware patterns you can copy for new areas.",
  },
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={cn(
              "text-3xl font-semibold tracking-tight sm:text-4xl",
              "[font-family:var(--font-marketing-heading)]",
            )}
          >
            Everything you retype on every new project
          </h2>
          <p className="mt-4 text-muted-foreground">
            Opinionated defaults with escape hatches—swap providers, keep the
            architecture.
          </p>
        </div>
        <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="group rounded-2xl border border-border/70 bg-card/50 p-6 shadow-sm transition-colors hover:border-border hover:bg-card/80"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
