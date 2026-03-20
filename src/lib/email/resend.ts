import { Resend } from "resend";

let resendClient: Resend | null = null;

function formatResendApiError(error: unknown): string {
  if (error == null) return "Resend returned an empty error.";
  if (typeof error === "string") return error;
  if (typeof error !== "object") return String(error);

  const obj = error as Record<string, unknown>;

  const rawMessage = obj.message;
  if (typeof rawMessage === "string" && rawMessage.trim()) {
    return rawMessage.trim();
  }
  if (Array.isArray(rawMessage)) {
    return rawMessage.map(String).join("; ");
  }

  if (Array.isArray(obj.errors)) {
    try {
      return JSON.stringify(obj.errors);
    } catch {
      return "Resend validation error (see server logs).";
    }
  }

  if (typeof obj.error === "string") return obj.error;

  try {
    const json = JSON.stringify(obj);
    if (json && json !== "{}") return json;
  } catch {
    /* ignore */
  }

  const name = typeof obj.name === "string" ? obj.name : "resend_error";
  const code =
    typeof obj.statusCode === "number" ? ` (HTTP ${obj.statusCode})` : "";
  return `${name}${code}`;
}

function normalizeResendFailure(error: unknown): {
  message: string;
  statusCode: number | null;
  name?: string;
} {
  const message = formatResendApiError(error);
  if (error && typeof error === "object") {
    const o = error as Record<string, unknown>;
    const statusCode =
      typeof o.statusCode === "number" ? o.statusCode : null;
    const name = typeof o.name === "string" ? o.name : undefined;
    return { message, statusCode, name };
  }
  return { message, statusCode: null };
}

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  if (!resendClient) {
    resendClient = new Resend(key);
  }
  return resendClient;
}

export function isResendConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim(),
  );
}

/** POST /api/test/resend is allowed in development or when explicitly enabled. */
export function isResendTestEndpointAllowed(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ALLOW_TEST_EMAIL === "true"
  );
}

export async function sendResendEmailNow(payload: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<
  | { ok: true; id: string }
  | {
      ok: false;
      error: string;
      resendStatusCode: number | null;
      resendErrorName?: string;
    }
> {
  const from = process.env.EMAIL_FROM?.trim();
  const resend = getClient();
  if (!resend || !from) {
    return {
      ok: false,
      error: "RESEND_API_KEY and EMAIL_FROM must be set.",
      resendStatusCode: null,
    };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
    if (result.error) {
      const normalized = normalizeResendFailure(result.error);
      if (process.env.NODE_ENV === "development") {
        console.error("[resend] send failed", {
          from,
          to: payload.to,
          raw: result.error,
          ...normalized,
        });
      }
      return {
        ok: false,
        error: normalized.message,
        resendStatusCode: normalized.statusCode,
        ...(normalized.name ? { resendErrorName: normalized.name } : {}),
      };
    }
    const id =
      result.data &&
      typeof result.data === "object" &&
      "id" in result.data &&
      typeof (result.data as { id: unknown }).id === "string"
        ? (result.data as { id: string }).id
        : undefined;
    if (!id) {
      if (process.env.NODE_ENV === "development") {
        console.error("[resend] success body missing id", result.data);
      }
      return {
        ok: false,
        error: "Resend returned no message id.",
        resendStatusCode: null,
      };
    }
    return { ok: true, id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.error("[resend] send threw", error);
    }
    return {
      ok: false,
      error: message,
      resendStatusCode: null,
    };
  }
}

/**
 * Fire-and-forget transactional email (Better Auth recommends not awaiting to
 * reduce timing leaks). Logs failures in development.
 */
export function queueResendEmail(payload: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): void {
  const from = process.env.EMAIL_FROM?.trim();
  const resend = getClient();
  if (!resend || !from) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[resend] Skipping send (set RESEND_API_KEY and EMAIL_FROM):",
        payload.subject,
      );
    }
    return;
  }

  void resend.emails
    .send({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    })
    .then((result) => {
      if (result.error) {
        console.error("[resend]", result.error);
      }
    })
    .catch((error: unknown) => {
      console.error("[resend]", error);
    });
}
