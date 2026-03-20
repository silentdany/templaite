"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { fetchBootstrapStatus } from "@/lib/bootstrap-status";
import { cn } from "@/lib/utils";

interface PolarClientActions {
  checkout: (opts: { slug?: string; products?: string[] }) => Promise<unknown>;
}

function getPolarClient(): PolarClientActions {
  return authClient as unknown as PolarClientActions;
}

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
    polar: false as const,
  },
  {
    name: "Pro",
    price: "Polar",
    period: "checkout",
    description: "Bill customers when you enable Polar with a product + slug in env.",
    features: [
      "Polar checkout + portal plugin",
      "Stripe-class flow via Better Auth",
      "Optional webhooks wiring",
      "Same codebase as Starter",
    ],
    cta: "Subscribe with Polar",
    href: "/login?callbackUrl=/billing",
    highlight: true,
    polar: true as const,
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
    polar: false as const,
  },
] as const;

export function PricingSection() {
  const { data: session } = authClient.useSession();
  const { data: status, isPending: statusLoading } = useQuery({
    queryKey: ["bootstrap-status", session?.user?.id ?? "anon"],
    queryFn: fetchBootstrapStatus,
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const canPolarCheckout =
    status?.polarServerEnabled &&
    status?.polarCheckoutReady &&
    (status.polarCheckoutSlug ?? status.polarCheckoutProductId);

  async function startPolarCheckout() {
    setCheckoutError(null);
    if (!canPolarCheckout) {
      setCheckoutError(
        "Configure POLAR_ACCESS_TOKEN, POLAR_CHECKOUT_PRODUCT_ID, and POLAR_CHECKOUT_SLUG.",
      );
      return;
    }
    setCheckoutLoading(true);
    try {
      const polar = getPolarClient();
      if (status?.polarCheckoutSlug) {
        await polar.checkout({ slug: status.polarCheckoutSlug });
        return;
      }
      const id = status?.polarCheckoutProductId;
      if (id) await polar.checkout({ products: [id] });
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

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
            Start free. When you wire Polar, the Pro plan uses your real checkout—same
            session and Better Auth flow as the billing playground.
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
                  Polar-ready
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
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.polar ? (
                  <div className="space-y-2">
                    {session?.user ? (
                      <Button
                        type="button"
                        className="inline-flex w-full gap-2 rounded-xl"
                        size="lg"
                        disabled={
                          checkoutLoading ||
                          statusLoading ||
                          !canPolarCheckout
                        }
                        onClick={() => void startPolarCheckout()}
                      >
                        {checkoutLoading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Opening checkout…
                          </>
                        ) : (
                          plan.cta
                        )}
                      </Button>
                    ) : (
                      <Button
                        nativeButton={false}
                        className="w-full rounded-xl"
                        size="lg"
                        render={<Link href={plan.href} />}
                      >
                        Sign in to subscribe
                      </Button>
                    )}
                    {checkoutError ? (
                      <p className="text-xs text-destructive" role="alert">
                        {checkoutError}
                      </p>
                    ) : null}
                    {!session?.user ? (
                      <p className="text-xs text-muted-foreground">
                        Polar checkout requires a signed-in account (
                        <code className="text-[0.7rem]">
                          authenticatedUsersOnly
                        </code>
                        ). Use the button above after login.
                      </p>
                    ) : !canPolarCheckout && !statusLoading ? (
                      <p className="text-xs text-muted-foreground">
                        Set Polar env vars to enable checkout (see{" "}
                        <code className="text-[0.7rem]">.env.example</code>).
                      </p>
                    ) : null}
                  </div>
                ) : plan.href.startsWith("mailto:") ? (
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
