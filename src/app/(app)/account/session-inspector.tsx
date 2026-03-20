"use client";

import { authClient } from "@/lib/auth-client";

export function SessionInspector() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground">Loading session…</p>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error.message}
      </p>
    );
  }

  if (!session) {
    return (
      <p className="text-sm text-muted-foreground">
        No session. If you see this while signed in, check cookies and{" "}
        <code className="text-xs">BETTER_AUTH_URL</code>.
      </p>
    );
  }

  return (
    <pre className="text-xs overflow-auto rounded-lg border border-border bg-muted/40 p-4 max-h-[min(70vh,32rem)]">
      {JSON.stringify(session, null, 2)}
    </pre>
  );
}
