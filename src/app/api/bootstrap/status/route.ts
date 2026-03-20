import { NextResponse } from "next/server";
import { getAiChatResolution } from "@/lib/ai-chat-config";
import {
  isResendConfigured,
  isResendTestEndpointAllowed,
} from "@/lib/email/resend";
import { isGoogleAuthConfigured } from "@/lib/google-auth";

export function GET() {
  const polarCheckoutProductId = process.env.POLAR_CHECKOUT_PRODUCT_ID;
  const polarCheckoutSlug = process.env.POLAR_CHECKOUT_SLUG;
  const ai = getAiChatResolution();

  return NextResponse.json({
      chatEnabled: ai.enabled,
      aiProvider: ai.provider,
      polarServerEnabled: Boolean(process.env.POLAR_ACCESS_TOKEN),
      polarCheckoutReady: Boolean(polarCheckoutProductId && polarCheckoutSlug),
      polarCheckoutSlug: polarCheckoutSlug ?? null,
      polarCheckoutProductId: polarCheckoutProductId ?? null,
      polarWebhookConfigured: Boolean(process.env.POLAR_WEBHOOK_SECRET),
      checkoutSuccessPath: "/checkout/success",
      googleAuthEnabled: isGoogleAuthConfigured(),
      resendEmailEnabled: isResendConfigured(),
      resendTestEndpointAllowed: isResendTestEndpointAllowed(),
      resendTestEndpointEnabled:
        isResendConfigured() && isResendTestEndpointAllowed(),
    });
}
