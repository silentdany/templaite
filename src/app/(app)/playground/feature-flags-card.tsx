"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchBootstrapStatus } from "@/lib/bootstrap-status";

function Flag({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={enabled ? "text-foreground font-medium" : "text-destructive"}>
        {enabled ? "on" : "off"}
      </span>
    </div>
  );
}

export function FeatureFlagsCard() {
  const { data, isError, error } = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: fetchBootstrapStatus,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Integration flags</CardTitle>
        <CardDescription>
          Derived from server env (see <code className="text-xs">.env.example</code>).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <p className="text-sm text-destructive" role="alert">
            {error instanceof Error ? error.message : "Failed to load"}
          </p>
        ) : data ? (
          <div>
            <Flag
              label={`AI chat (${data.aiProvider === "gateway" ? "Vercel Gateway" : data.aiProvider === "openai" ? "OpenAI direct" : "off"})`}
              enabled={data.chatEnabled}
            />
            <Flag label="Google OAuth" enabled={data.googleAuthEnabled} />
            <Flag
              label="Resend (verify + password reset)"
              enabled={data.resendEmailEnabled}
            />
            <Flag
              label="Resend test route (/api/test/resend)"
              enabled={data.resendTestEndpointEnabled}
            />
            <Flag label="Polar server (token)" enabled={data.polarServerEnabled} />
            <Flag label="Polar checkout (slug + product)" enabled={data.polarCheckoutReady} />
            <Flag label="Polar webhooks secret" enabled={data.polarWebhookConfigured} />
            <p className="text-xs text-muted-foreground mt-3">
              Checkout redirect:{" "}
              <code className="text-[0.65rem]">{data.checkoutSuccessPath}</code>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}
      </CardContent>
    </Card>
  );
}
