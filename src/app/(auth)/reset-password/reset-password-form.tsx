"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const urlError = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const tokenInvalid = urlError === "INVALID_TOKEN";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Missing token. Open the link from your email again.");
      return;
    }
    setIsPending(true);
    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (res.error) {
        setError(res.error.message ?? "Could not reset password");
        return;
      }
      router.push("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  if (tokenInvalid) {
    return (
      <div className="grid gap-3 text-sm">
        <p className="text-destructive" role="alert">
          This reset link is invalid or has expired.
        </p>
        <Button nativeButton={false} variant="outline" render={<Link href="/forgot-password" />}>
          Request a new link
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        Missing reset token. Use the link from your email, or{" "}
        <Link href="/forgot-password" className="text-primary underline-offset-4 hover:underline">
          request a new reset
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
