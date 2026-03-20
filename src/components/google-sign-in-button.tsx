"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface GoogleSignInButtonProps {
  callbackUrl: string;
  className?: string;
}

export function GoogleSignInButton({
  callbackUrl,
  className,
}: GoogleSignInButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);
    setIsPending(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
      if (res.error) {
        setError(res.error.message ?? "Google sign-in failed");
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        className={className}
        disabled={isPending}
        onClick={onClick}
      >
        {isPending ? "Redirecting…" : "Continue with Google"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
