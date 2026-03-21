/** Generate src/lib/auth.ts for the selected feature set. */
export function buildAuthTs(f) {
    if (!f.auth || !f.database) {
        throw new Error("buildAuthTs requires auth and database");
    }
    const polarImports = f.payments
        ? `import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
`
        : "";
    const resendImport = f.resend
        ? `import { isResendConfigured, queueResendEmail } from "./email/resend";
`
        : "";
    const polarFn = f.payments
        ? `
function buildPolarPlugin(): ReturnType<typeof polar>[] {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    return [];
  }

  const polarClient = new Polar({
    accessToken,
    server:
      process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
  });

  const polarUse = [
    portal({
      returnUrl: baseUrl,
    }),
  ] as unknown as Parameters<typeof polar>[0]["use"];

  const productId = process.env.POLAR_CHECKOUT_PRODUCT_ID;
  const slug = process.env.POLAR_CHECKOUT_SLUG;
  if (productId && slug) {
    polarUse.unshift(
      checkout({
        products: [{ productId, slug }],
        successUrl: \`\${baseUrl}/checkout/success?checkout_id={CHECKOUT_ID}\`,
        authenticatedUsersOnly: true,
      }) as (typeof polarUse)[number],
    );
  }

  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (webhookSecret) {
    polarUse.push(
      webhooks({
        secret: webhookSecret,
        async onPayload() {
          /* Polar posts to /api/auth/polar/webhooks */
        },
      }) as (typeof polarUse)[number],
    );
  }

  return [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: polarUse,
    }),
  ];
}
`
        : "";
    const googleVars = f.googleOAuth
        ? `
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
`
        : "";
    const resendFlag = f.resend ? "const resendEmail = isResendConfigured();\n" : "const resendEmail = false;\n";
    const emailPassword = f.resend
        ? `  emailAndPassword: {
    enabled: true,
    ...(resendEmail
      ? {
          sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
            queueResendEmail({
              to: user.email,
              subject: "Reset your Templaite password",
              text: \`Reset your password: \${url}\`,
              html: \`<p>Reset your password:</p><p><a href="\${url}">\${url}</a></p>\`,
            });
          },
        }
      : {}),
  },
`
        : `  emailAndPassword: {
    enabled: true,
  },
`;
    const emailVerification = f.resend
        ? `  ...(resendEmail
    ? {
        emailVerification: {
          sendOnSignUp: true,
          autoSignInAfterVerification: true,
          sendVerificationEmail: async ({ user, url }: { user: { email: string }; url: string }) => {
            queueResendEmail({
              to: user.email,
              subject: "Verify your Templaite email",
              text: \`Verify your email: \${url}\`,
              html: \`<p>Verify your email address:</p><p><a href="\${url}">\${url}</a></p>\`,
            });
          },
        },
      }
    : {}),
`
        : "";
    const social = f.googleOAuth
        ? `  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            prompt: "select_account",
          },
        },
      }
    : {}),
`
        : "";
    const plugins = f.payments
        ? "  plugins: [nextCookies(), ...buildPolarPlugin()],\n"
        : "  plugins: [nextCookies()],\n";
    return `import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
${polarImports}${resendImport}import { prisma } from "./prisma";

function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (secret) return secret;

  const isProdBuild =
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

  if (process.env.NODE_ENV === "production" && !isProdBuild) {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }

  return "dev-insecure-secret-change-me";
}

const baseUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";
${polarFn}${googleVars}${resendFlag}
export const auth = betterAuth({
  appName: "templaite",
  baseURL: baseUrl,
  secret: getAuthSecret(),
  trustedOrigins: [baseUrl],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
${emailPassword}${emailVerification}${social}${plugins}});
`;
}
