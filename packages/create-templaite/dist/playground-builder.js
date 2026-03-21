export function buildPlaygroundPageTs(f) {
    const links = [
        {
            href: "/account",
            title: "Account",
            description: "Session and user payload from Better Auth.",
        },
    ];
    if (f.payments) {
        links.push({
            href: "/billing",
            title: "Billing (Polar)",
            description: "Checkout, portal, customer state, and list endpoints.",
        });
    }
    if (f.aiChat) {
        links.push({
            href: "/chat",
            title: "Chat",
            description: "AI SDK streaming via POST /api/chat.",
        });
    }
    links.push({
        href: "/dashboard",
        title: "Dashboard",
        description: "Default post-login landing.",
    });
    const linksLiteral = links
        .map((l) => `  {
    href: "${l.href}",
    title: "${l.title}",
    description: "${l.description}",
  },`)
        .join("\n");
    const resendImport = f.resend
        ? `import { ResendTestPanel } from "./resend-test-panel";
`
        : "";
    const resendBlock = f.resend
        ? `
      <ResendTestPanel />`
        : "";
    return `import Link from "next/link";
import { ApiSmokePanel } from "./api-smoke-panel";
import { FeatureFlagsCard } from "./feature-flags-card";
${resendImport}import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const links = [
${linksLiteral}
] as const;

export default function PlaygroundPage() {
  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Smoke-test integrations after setting environment variables. All links
          below require a signed-in session.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <Card key={item.href}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                nativeButton={false}
                size="sm"
                variant="outline"
                render={<Link href={item.href} />}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FeatureFlagsCard />
        <ApiSmokePanel />
      </div>${resendBlock}
    </div>
  );
}
`;
}
