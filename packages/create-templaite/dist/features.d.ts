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
export declare const DEFAULT_FEATURES: TemplaiteFeatures;
export declare function validateFeatures(f: TemplaiteFeatures): string | null;
export declare function featuresFromPrompts(input: {
    authWithDatabase: boolean;
    payments: boolean;
    resend: boolean;
    googleOAuth: boolean;
    aiChat: boolean;
    notionBlog: boolean;
}): TemplaiteFeatures;
