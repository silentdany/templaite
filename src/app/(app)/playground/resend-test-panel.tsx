"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchBootstrapStatus } from "@/lib/bootstrap-status";

interface ResendTestSuccessResponse {
  ok: true;
  id: string;
}

interface ResendTestErrorBody {
  error?: string;
}

export function ResendTestPanel() {
  const bootstrap = useQuery({
    queryKey: ["bootstrap-status"],
    queryFn: fetchBootstrapStatus,
  });

  const sendTest = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/test/resend", { method: "POST" });
      const body = (await response.json()) as
        | ResendTestSuccessResponse
        | ResendTestErrorBody;
      if (!response.ok) {
        const message =
          typeof body === "object" && body && "error" in body && body.error
            ? String(body.error)
            : `Request failed (${response.status})`;
        const code =
          typeof body === "object" &&
          body &&
          "code" in body &&
          typeof body.code === "string"
            ? body.code
            : undefined;
        throw new Error(code ? `${message} (${code})` : message);
      }
      if (!("ok" in body) || body.ok !== true || !("id" in body)) {
        throw new Error("Unexpected response");
      }
      return body.id;
    },
  });

  const canUse =
    bootstrap.data?.resendTestEndpointEnabled === true &&
    bootstrap.data?.resendEmailEnabled === true;

  const isLoadingBootstrap = bootstrap.isPending || !bootstrap.data;
  const sendDisabled = isLoadingBootstrap || !canUse || sendTest.isPending;

  let gateMessage: string | null = null;
  if (!isLoadingBootstrap && !canUse && bootstrap.data) {
    gateMessage = !bootstrap.data.resendEmailEnabled
      ? "Set RESEND_API_KEY and EMAIL_FROM, then reload."
      : !bootstrap.data.resendTestEndpointAllowed
        ? "Enable with ALLOW_TEST_EMAIL=true outside development."
        : "Test email route is not available.";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resend test email</CardTitle>
        <CardDescription>
          POST <code className="text-xs">/api/test/resend</code> sends one
          message to your signed-in email. Only in development unless{" "}
          <code className="text-xs">ALLOW_TEST_EMAIL=true</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          type="button"
          disabled={sendDisabled}
          onClick={() => {
            if (!sendDisabled) sendTest.mutate();
          }}
        >
          {sendTest.isPending
            ? "Sending…"
            : isLoadingBootstrap
              ? "Loading…"
              : "Send test email"}
        </Button>
        {isLoadingBootstrap ? (
          <p className="text-sm text-muted-foreground">
            Checking Resend / environment flags…
          </p>
        ) : null}
        {gateMessage ? (
          <p className="text-sm text-muted-foreground">{gateMessage}</p>
        ) : null}
        {sendTest.isError ? (
          <p className="text-sm text-destructive" role="alert">
            {sendTest.error instanceof Error
              ? sendTest.error.message
              : "Failed"}
          </p>
        ) : null}
        {sendTest.isSuccess ? (
          <p className="text-sm text-muted-foreground">
            Sent. Resend id:{" "}
            <code className="text-xs wrap-break-word">{sendTest.data}</code>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
