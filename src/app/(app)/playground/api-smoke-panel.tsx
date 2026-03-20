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

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm border-b border-border last:border-0 py-2">
      <span className="font-medium">{label}</span>
      <span className={ok ? "text-muted-foreground" : "text-destructive"}>
        {ok ? "ok" : "disabled / error"}
        {detail ? (
          <span className="block text-xs font-normal mt-0.5 wrap-break-word">
            {detail}
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function ApiSmokePanel() {
  const bootstrap = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: fetchBootstrapStatus,
  });

  const demo = useQuery({
    queryKey: ["api-demo"],
    queryFn: async () => {
      const r = await fetch("/api/demo");
      return r.json() as Promise<{ ok: boolean }>;
    },
  });

  const ping = useQuery({
    queryKey: ["api-demo-ping"],
    queryFn: async () => {
      const r = await fetch("/api/demo/ping");
      return r.json() as Promise<{ pong: boolean }>;
    },
  });

  const chatProbe = useQuery({
    queryKey: ["api-chat-get"],
    queryFn: async () => {
      const r = await fetch("/api/chat");
      return r.json() as Promise<{
        chatEnabled: boolean;
        aiProvider?: string;
      }>;
    },
  });

  const bootstrapData = bootstrap.data;
  let bootstrapSummary: string | undefined;
  if (bootstrapData) {
    const b = bootstrapData;
    bootstrapSummary = [
      `chat: ${b.chatEnabled} (${b.aiProvider}) · google: ${b.googleAuthEnabled} · resend: ${b.resendEmailEnabled} · resendTest: ${b.resendTestEndpointEnabled}`,
      `polar: ${b.polarServerEnabled}`,
      `checkout: ${b.polarCheckoutReady}`,
      `webhook: ${b.polarWebhookConfigured}`,
    ].join(" · ");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">API smoke tests</CardTitle>
        <CardDescription>
          TanStack Query + public routes (no secrets returned).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        <StatusRow
          label="GET /api/bootstrap/status"
          ok={bootstrap.isSuccess}
          detail={
            bootstrap.error instanceof Error
              ? bootstrap.error.message
              : bootstrapSummary
          }
        />
        <StatusRow
          label="GET /api/demo"
          ok={demo.isSuccess && demo.data?.ok === true}
          detail={
            demo.error instanceof Error
              ? demo.error.message
              : demo.data
                ? JSON.stringify(demo.data)
                : undefined
          }
        />
        <StatusRow
          label="GET /api/demo/ping"
          ok={ping.isSuccess && ping.data?.pong === true}
          detail={
            ping.error instanceof Error
              ? ping.error.message
              : ping.data
                ? JSON.stringify(ping.data)
                : undefined
          }
        />
        <StatusRow
          label="GET /api/chat"
          ok={chatProbe.isSuccess}
          detail={
            chatProbe.error instanceof Error
              ? chatProbe.error.message
              : chatProbe.data
                ? JSON.stringify(chatProbe.data)
                : undefined
          }
        />
      </CardContent>
    </Card>
  );
}
