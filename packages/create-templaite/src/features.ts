/**
 * Feature manifest for scaffolded projects.
 * Auth and database are paired: Better Auth uses Prisma in this boilerplate.
 */
export interface TemplaiteFeatures {
  /** Prisma + Postgres (required when auth is enabled) */
  database: boolean;
  /** Better Auth + email/password (+ optional Google, Resend, Polar) */
  auth: boolean;
  /** Polar checkout / portal / webhooks */
  payments: boolean;
  /** Resend for verification + password reset emails */
  resend: boolean;
  /** Google OAuth (still requires auth) */
  googleOAuth: boolean;
  /** AI SDK streaming chat + /api/chat */
  aiChat: boolean;
  /** Notion-backed /blog */
  notionBlog: boolean;
}

export const DEFAULT_FEATURES: TemplaiteFeatures = {
  database: true,
  auth: true,
  payments: true,
  resend: true,
  googleOAuth: true,
  aiChat: true,
  notionBlog: true,
};

export function validateFeatures(f: TemplaiteFeatures): string | null {
  if (f.auth && !f.database) {
    return "Auth requires database (Prisma + Postgres) in this template.";
  }
  if (f.database && !f.auth) {
    return "Database without auth is not supported in this CLI yet; disable database or enable auth.";
  }
  if (f.payments && !f.auth) {
    return "Payments (Polar) requires auth + database.";
  }
  if (f.resend && !f.auth) {
    return "Resend is only wired for Better Auth emails; enable auth or disable Resend.";
  }
  if (f.googleOAuth && !f.auth) {
    return "Google OAuth requires auth.";
  }
  return null;
}

export function featuresFromPrompts(input: {
  authWithDatabase: boolean;
  payments: boolean;
  resend: boolean;
  googleOAuth: boolean;
  aiChat: boolean;
  notionBlog: boolean;
}): TemplaiteFeatures {
  const database = input.authWithDatabase;
  const auth = input.authWithDatabase;
  return {
    database,
    auth,
    payments: auth && input.payments,
    resend: auth && input.resend,
    googleOAuth: auth && input.googleOAuth,
    aiChat: input.aiChat,
    notionBlog: input.notionBlog,
  };
}
