import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

function getAuthSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }
  return "dev-insecure-secret-change-me";
}

const baseUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

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
        successUrl: `${baseUrl}/checkout/success?checkout_id={CHECKOUT_ID}`,
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
          /* Add app-specific handling; Polar posts to /api/auth/polar/webhooks */
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

export const auth = betterAuth({
  appName: "templaite",
  baseURL: baseUrl,
  secret: getAuthSecret(),
  trustedOrigins: [baseUrl],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies(), ...buildPolarPlugin()],
});
