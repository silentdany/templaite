import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SessionInspector } from "./session-inspector";

export default function AccountPage() {
  return (
    <div className="p-6 max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Raw session from <code className="text-xs">authClient.useSession()</code>
          .
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session JSON</CardTitle>
          <CardDescription>
            Useful for verifying sign-in and Better Auth shape in development.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionInspector />
        </CardContent>
      </Card>
    </div>
  );
}
