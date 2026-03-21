"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "",
    description: "Fork, run locally, and ship an MVP with auth and DB.",
    features: [
      "Next.js 16 App Router",
      "Better Auth + Prisma",
      "Playground + bootstrap API",
      "shadcn/ui baseline",
    ],
    cta: "Create account",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Custom",
    period: "",
    description:
      "Payments were not selected in create-templaite — add Polar or Stripe when you need billing.",
    features: [
      "Same codebase as Starter",
      "Bring your own payment provider",
      "Extend with webhooks",
      "Own your data",
    ],
    cta: "View docs",
    href: "/use-cases",
    highlight: true,
  },
  {
    name: "Team",
    price: "Custom",
    period: "",
    description: "Bring your org SSO, auditing, and deployment policies—extend the template.",
    features: [
      "Dedicated support via your team",
      "Audit-friendly env patterns",
      "Fork and own every line",
      "No vendor lock-in on data",
    ],
    cta: "Contact",
    href: "mailto:hello@example.com",
    highlight: false,
  },
] as const;

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={cn(
              "text-3xl font-semibold tracking-tight sm:text-4xl",
              "[font-family:var(--font-marketing-heading)]",
            )}
          >
            Pricing that stays out of the README
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Add payments when you wire a provider — this scaffold was generated
            without the Polar integration layer.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 shadow-sm transition-colors",
                plan.highlight
                  ? "border-primary/40 bg-card shadow-md shadow-primary/10 ring-1 ring-primary/15"
                  : "border-border/70 bg-card/60",
              )}
            >
              {plan.highlight ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Flexible
                </span>
              ) : null}
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight tabular-nums [font-family:var(--font-marketing-heading)]">
                    {plan.price}
                  </span>
                  {plan.period ? (
                    <span className="text-sm text-muted-foreground">
                      / {plan.period}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.href.startsWith("mailto:") ? (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    className="w-full rounded-xl"
                    size="lg"
                    render={<a href={plan.href} />}
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Button
                    nativeButton={false}
                    variant={plan.highlight ? "default" : "outline"}
                    className="w-full rounded-xl"
                    size="lg"
                    render={<Link href={plan.href} />}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
