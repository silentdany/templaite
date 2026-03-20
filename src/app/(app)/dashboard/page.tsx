import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          You are signed in. Protected by middleware and Better Auth.
        </p>
      </div>
      <div className="grid gap-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Playground</CardTitle>
            <CardDescription>
              Integration flags, API smoke tests, and links to Account / Billing
              exercisers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/playground" />}>
              Open playground
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Try the chat demo</CardTitle>
            <CardDescription>
              Streaming via the AI SDK — set{" "}
              <code className="text-xs">AI_GATEWAY_API_KEY</code> or{" "}
              <code className="text-xs">OPENAI_API_KEY</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button nativeButton={false} render={<Link href="/chat" />}>
              Open chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
