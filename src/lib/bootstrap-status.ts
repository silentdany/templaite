import type { AiChatProvider } from "@/lib/ai-chat-config";

export interface BootstrapStatus {
  chatEnabled: boolean;
  aiProvider: AiChatProvider;
  googleAuthEnabled: boolean;
  resendEmailEnabled: boolean;
  /** Dev or ALLOW_TEST_EMAIL=true; still requires Resend env. */
  resendTestEndpointAllowed: boolean;
  /** Resend configured and test route allowed (for UI gating). */
  resendTestEndpointEnabled: boolean;
  polarServerEnabled: boolean;
  polarCheckoutReady: boolean;
  /** Set only when the request includes a session; anonymous callers always see `null`. */
  polarCheckoutSlug: string | null;
  /** Set only when the request includes a session; anonymous callers always see `null`. */
  polarCheckoutProductId: string | null;
  polarWebhookConfigured: boolean;
  checkoutSuccessPath: string;
}

export async function fetchBootstrapStatus(): Promise<BootstrapStatus> {
  const response = await fetch("/api/bootstrap/status", {
    credentials: "same-origin",
  });
  if (!response.ok) {
    throw new Error(`Bootstrap status failed: ${response.status}`);
  }
  return response.json() as Promise<BootstrapStatus>;
}
