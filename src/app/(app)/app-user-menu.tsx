"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AppUserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function onSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return <span className="text-muted-foreground text-sm">…</span>;
  }

  if (!session?.user) {
    return (
      <Button nativeButton={false} render={<Link href="/login" />} size="sm" variant="outline">
        Log in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground truncate max-w-[12rem]">
        {session.user.email}
      </span>
      <Button size="sm" variant="outline" type="button" onClick={onSignOut}>
        Sign out
      </Button>
    </div>
  );
}
