/** Build src/proxy.ts for the selected feature set. */
export function buildProxyTs(f) {
    if (!f.auth) {
        return `import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [] as string[],
};
`;
    }
    const prefixes = [
        "/dashboard",
        "/playground",
        "/account",
    ];
    if (f.payments)
        prefixes.push("/billing");
    if (f.aiChat)
        prefixes.push("/chat");
    const matcherLines = prefixes.flatMap((p) => [
        `    "${p}",`,
        `    "${p}/:path*",`,
    ]);
    return `import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPrefixes = [
${prefixes.map((p) => `  "${p}",`).join("\n")}
] as const;

function isProtectedPath(pathname: string): boolean {
  return protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(\`\${prefix}/\`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
${matcherLines.join("\n")}
  ],
};
`;
}
