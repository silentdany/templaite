import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  isResendConfigured,
  isResendTestEndpointAllowed,
  sendResendEmailNow,
} from "@/lib/email/resend";

function httpStatusFromResendFailure(resendStatusCode: number | null): number {
  if (resendStatusCode == null) return 502;
  if (resendStatusCode >= 400 && resendStatusCode < 600) {
    return resendStatusCode;
  }
  return 502;
}

export async function POST() {
  if (!isResendTestEndpointAllowed()) {
    return NextResponse.json(
      { error: "Test email endpoint is disabled." },
      { status: 403 },
    );
  }

  if (!isResendConfigured()) {
    return NextResponse.json(
      { error: "Resend is not configured (RESEND_API_KEY and EMAIL_FROM)." },
      { status: 503 },
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sent = await sendResendEmailNow({
    to: email,
    subject: "Templaite — Resend test",
    text: "If you received this, Resend is wired correctly for your account.",
    html: "<p>If you received this, Resend is wired correctly for your account.</p>",
  });

  if (!sent.ok) {
    const status = httpStatusFromResendFailure(sent.resendStatusCode);
    return NextResponse.json(
      {
        error: sent.error,
        ...(sent.resendErrorName ? { code: sent.resendErrorName } : {}),
      },
      { status },
    );
  }

  return NextResponse.json({ ok: true as const, id: sent.id });
}
