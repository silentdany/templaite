export const DEFAULT_FEATURES = {
    database: true,
    auth: true,
    payments: true,
    resend: true,
    googleOAuth: true,
    aiChat: true,
    notionBlog: true,
};
export function validateFeatures(f) {
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
export function featuresFromPrompts(input) {
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
