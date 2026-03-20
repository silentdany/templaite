import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAiChatResolution } from "@/lib/ai-chat-config";
import {
  isResendConfigured,
  isResendTestEndpointAllowed,
} from "@/lib/email/resend";
import { isGoogleAuthConfigured } from "@/lib/google-auth";

export async function GET() {
  const polarCheckoutProductId = process.env.POLAR_CHECKOUT_PRODUCT_ID;
  const polarCheckoutSlug = process.env.POLAR_CHECKOUT_SLUG;
  const ai = getAiChatResolution();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const authenticated = Boolean(session?.user);

  return NextResponse.json({
    chatEnabled: ai.enabled,
    aiProvider: ai.provider,
    polarServerEnabled: Boolean(process.env.POLAR_ACCESS_TOKEN),
    polarCheckoutReady: Boolean(polarCheckoutProductId && polarCheckoutSlug),
    polarCheckoutSlug: authenticated ? (polarCheckoutSlug ?? null) : null,
    polarCheckoutProductId: authenticated
      ? (polarCheckoutProductId ?? null)
      : null,
    polarWebhookConfigured: Boolean(process.env.POLAR_WEBHOOK_SECRET),
    checkoutSuccessPath: "/checkout/success",
    googleAuthEnabled: isGoogleAuthConfigured(),
    resendEmailEnabled: isResendConfigured(),
    resendTestEndpointAllowed: isResendTestEndpointAllowed(),
    resendTestEndpointEnabled:
      isResendConfigured() && isResendTestEndpointAllowed(),
  });
}
