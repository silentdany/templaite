export function filterPackageJson(pkg, f) {
    const next = { ...pkg };
    const deps = {
        ...(next.dependencies ?? {}),
    };
    const devDeps = {
        ...(next.devDependencies ?? {}),
    };
    function remove(key) {
        delete deps[key];
        delete devDeps[key];
    }
    if (!f.aiChat) {
        remove("@ai-sdk/openai");
        remove("@ai-sdk/react");
        remove("ai");
    }
    if (!f.notionBlog) {
        remove("@notionhq/client");
        remove("notion-to-md");
    }
    if (!f.payments) {
        remove("@polar-sh/better-auth");
        remove("@polar-sh/sdk");
    }
    if (!f.database) {
        remove("@prisma/client");
        remove("@prisma/adapter-pg");
        remove("pg");
        remove("prisma");
        remove("@types/pg");
    }
    if (!f.auth) {
        remove("better-auth");
        remove("@better-auth/prisma-adapter");
        remove("@better-auth/cli");
    }
    if (!f.resend) {
        remove("resend");
    }
    next.dependencies = deps;
    next.devDependencies = devDeps;
    const scripts = {
        ...(next.scripts ?? {}),
    };
    if (!f.database) {
        delete scripts.postinstall;
    }
    if (scripts.test?.startsWith("vitest run") && !scripts.test.includes("passWithNoTests")) {
        scripts.test = "vitest run --passWithNoTests";
    }
    next.scripts = scripts;
    return next;
}
