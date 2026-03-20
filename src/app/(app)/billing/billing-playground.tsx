"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchBootstrapStatus } from "@/lib/bootstrap-status";

/** Polar actions attached by `polarClient()` — kept loose for optional server plugin. */
interface PolarClientActions {
  checkout: (opts: { slug?: string; products?: string[] }) => Promise<unknown>;
  customer: {
    portal: () => Promise<unknown>;
    state: () => Promise<{ data?: unknown; error?: { message?: string } | null }>;
    benefits: {
      list: (opts: {
        query: { page?: number; limit?: number };
      }) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
    };
    orders: {
      list: (opts: {
        query: { page?: number; limit?: number };
      }) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
    };
    subscriptions: {
      list: (opts: {
        query: { page?: number; limit?: number };
      }) => Promise<{ data?: unknown; error?: { message?: string } | null }>;
    };
  };
}

function getPolarClient(): PolarClientActions {
  return authClient as unknown as PolarClientActions;
}

export function BillingPlayground() {
  const { data: status, isLoading } = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: fetchBootstrapStatus,
  });

  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setOk(data: unknown) {
    setError(null);
    setOutput(JSON.stringify(data, null, 2));
  }

  function setBad(message: string) {
    setOutput(null);
    setError(message);
  }

  const polar = getPolarClient();
  const canPolar = status?.polarServerEnabled === true;
  const canCheckout = canPolar && status?.polarCheckoutReady === true;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Polar / Better Auth</CardTitle>
          <CardDescription>
            Calls use your session and{" "}
            <code className="text-xs">/api/auth/*</code>. Enable Polar in{" "}
            <code className="text-xs">src/lib/auth.ts</code> via{" "}
            <code className="text-xs">POLAR_ACCESS_TOKEN</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading flags…</p>
          ) : null}
          {!canPolar ? (
            <p className="text-sm text-destructive">
              Polar is off: set <code className="text-xs">POLAR_ACCESS_TOKEN</code>{" "}
              and restart the dev server.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              disabled={!canCheckout || !status?.polarCheckoutSlug}
              onClick={async () => {
                try {
                  await polar.checkout({
                    slug: status?.polarCheckoutSlug ?? undefined,
                  });
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              Checkout (slug)
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!canCheckout || !status?.polarCheckoutProductId}
              onClick={async () => {
                try {
                  const id = status?.polarCheckoutProductId;
                  if (!id) return;
                  await polar.checkout({ products: [id] });
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              Checkout (product id)
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canPolar}
              onClick={async () => {
                try {
                  await polar.customer.portal();
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              Customer portal
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!canPolar}
              onClick={async () => {
                try {
                  const res = await polar.customer.state();
                  if (res.error) {
                    setBad(res.error.message ?? "customer.state error");
                    return;
                  }
                  setOk(res.data);
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              Customer state
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={!canPolar}
              onClick={async () => {
                try {
                  const res = await polar.customer.benefits.list({
                    query: { page: 1, limit: 10 },
                  });
                  if (res.error) {
                    setBad(res.error.message ?? "benefits.list error");
                    return;
                  }
                  setOk(res.data);
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              List benefits
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={!canPolar}
              onClick={async () => {
                try {
                  const res = await polar.customer.orders.list({
                    query: { page: 1, limit: 10 },
                  });
                  if (res.error) {
                    setBad(res.error.message ?? "orders.list error");
                    return;
                  }
                  setOk(res.data);
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              List orders
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={!canPolar}
              onClick={async () => {
                try {
                  const res = await polar.customer.subscriptions.list({
                    query: { page: 1, limit: 10 },
                  });
                  if (res.error) {
                    setBad(
                      res.error.message ?? "subscriptions.list error",
                    );
                    return;
                  }
                  setOk(res.data);
                } catch (e) {
                  setBad(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              List subscriptions
            </Button>
          </div>
        </CardContent>
      </Card>

      {(output || error) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last result</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-sm text-destructive whitespace-pre-wrap">
                {error}
              </p>
            ) : (
              <pre className="text-xs overflow-auto rounded-lg border border-border bg-muted/40 p-4 max-h-[min(60vh,24rem)]">
                {output}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
