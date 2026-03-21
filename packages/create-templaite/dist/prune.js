import { copyFile, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildAppLayoutTs } from "./app-layout-builder.js";
import { buildAuthTs } from "./auth-builder.js";
import { buildEnvExample } from "./env-example.js";
import { filterPackageJson } from "./package-json.js";
import { buildPlaygroundPageTs } from "./playground-builder.js";
import { buildProxyTs } from "./proxy-builder.js";
import { buildSitemapTs } from "./sitemap-builder.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const assetsDir = path.join(__dirname, "../assets");
async function rmRel(targetDir, rel) {
    const p = path.join(targetDir, rel);
    if (existsSync(p))
        await rm(p, { recursive: true, force: true });
}
async function copyAsset(name, targetDir, destRel) {
    const src = path.join(assetsDir, name);
    const dest = path.join(targetDir, destRel);
    await copyFile(src, dest);
}
export async function pruneProject(targetDir, features) {
    if (!features.auth) {
        await pruneNoAuth(targetDir, features);
    }
    else {
        await pruneWithAuth(targetDir, features);
    }
    await rmRel(targetDir, "pnpm-lock.yaml");
}
async function pruneNoAuth(targetDir, features) {
    const remove = [
        "prisma",
        "prisma.config.ts",
        "src/lib/prisma.ts",
        "src/lib/auth.ts",
        "src/lib/auth-client.ts",
        "src/lib/bootstrap-status.ts",
        "src/lib/google-auth.ts",
        "src/lib/email",
        "src/lib/chat-rate-limit.ts",
        "src/lib/chat-rate-limit.test.ts",
        "src/app/(auth)",
        "src/app/(app)",
        "src/app/api/auth",
        "src/app/api/bootstrap",
        "src/app/api/test",
        "src/app/api/chat",
        "src/app/checkout",
        "src/proxy.ts",
        "src/components/google-sign-in-button.tsx",
    ];
    for (const rel of remove)
        await rmRel(targetDir, rel);
    if (!features.notionBlog) {
        await rmRel(targetDir, "src/app/blog");
        await rmRel(targetDir, "src/lib/notion");
        await rmRel(targetDir, "src/lib/blog");
    }
    await copyAsset(features.notionBlog
        ? "marketing-header-with-blog-no-auth.tsx"
        : "marketing-header-no-auth.tsx", targetDir, "src/components/marketing/marketing-header.tsx");
    await copyAsset(features.notionBlog
        ? "marketing-footer-no-auth-with-blog.tsx"
        : "marketing-footer-no-auth.tsx", targetDir, "src/components/marketing/sections/marketing-footer.tsx");
    await copyAsset("pricing-no-payments.tsx", targetDir, "src/components/marketing/sections/pricing-section.tsx");
    if (!features.notionBlog) {
        await writeFile(path.join(targetDir, "src/app/sitemap.ts"), buildSitemapTs(), "utf8");
    }
    /* When Notion blog is on, keep template sitemap (includes /blog routes). */
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
    await writeFile(pkgPath, `${JSON.stringify(filterPackageJson(pkg, features), null, 2)}\n`, "utf8");
    await patchMarketingStringsNoAuth(targetDir);
    await patchRootLayoutKeywords(targetDir, features);
    await writeManifestAndEnv(targetDir, features);
}
async function patchMarketingStringsNoAuth(targetDir) {
    const heroPath = path.join(targetDir, "src/components/marketing/sections/hero-section.tsx");
    let hero = await readFile(heroPath, "utf8");
    hero = hero.replaceAll('href="/signup"', 'href="#features"');
    await writeFile(heroPath, hero, "utf8");
    const ctaPath = path.join(targetDir, "src/components/marketing/sections/cta-section.tsx");
    let cta = await readFile(ctaPath, "utf8");
    cta = cta.replaceAll('href="/signup"', 'href="#pricing"');
    cta = cta.replaceAll('href="/login"', 'href="#faq"');
    await writeFile(ctaPath, cta, "utf8");
}
async function pruneWithAuth(targetDir, features) {
    if (!features.payments) {
        await rmRel(targetDir, "src/app/(app)/billing");
        await rmRel(targetDir, "src/app/checkout");
    }
    if (!features.aiChat) {
        await rmRel(targetDir, "src/app/(app)/chat");
        await rmRel(targetDir, "src/app/api/chat");
        await rmRel(targetDir, "src/lib/chat-rate-limit.ts");
        await rmRel(targetDir, "src/lib/chat-rate-limit.test.ts");
    }
    if (!features.notionBlog) {
        await rmRel(targetDir, "src/app/blog");
        await rmRel(targetDir, "src/lib/notion");
        await rmRel(targetDir, "src/lib/blog");
        await writeFile(path.join(targetDir, "src/app/sitemap.ts"), buildSitemapTs(), "utf8");
    }
    if (!features.resend) {
        await rmRel(targetDir, "src/app/api/test");
        await rmRel(targetDir, "src/app/(app)/playground/resend-test-panel.tsx");
    }
    await writeFile(path.join(targetDir, "src/lib/auth.ts"), buildAuthTs(features), "utf8");
    if (!features.googleOAuth) {
        await writeFile(path.join(targetDir, "src/lib/google-auth.ts"), `/** Google OAuth disabled at scaffold time. */
export function isGoogleAuthConfigured(): boolean {
  return false;
}
`, "utf8");
    }
    await writeFile(path.join(targetDir, "src/proxy.ts"), buildProxyTs(features), "utf8");
    await writeFile(path.join(targetDir, "src/app/(app)/layout.tsx"), buildAppLayoutTs(features), "utf8");
    await writeFile(path.join(targetDir, "src/app/(app)/playground/page.tsx"), buildPlaygroundPageTs(features), "utf8");
    if (!features.payments) {
        await copyAsset("pricing-no-payments.tsx", targetDir, "src/components/marketing/sections/pricing-section.tsx");
    }
    if (!features.notionBlog) {
        await copyAsset("marketing-footer-auth-no-blog.tsx", targetDir, "src/components/marketing/sections/marketing-footer.tsx");
        await patchMarketingHeaderRemoveBlog(targetDir);
    }
    await patchFooterAuthOptionalLinks(targetDir, features);
    const pkgPath = path.join(targetDir, "package.json");
    const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
    await writeFile(pkgPath, `${JSON.stringify(filterPackageJson(pkg, features), null, 2)}\n`, "utf8");
    await patchRootLayoutKeywords(targetDir, features);
    await writeManifestAndEnv(targetDir, features);
}
async function patchFooterAuthOptionalLinks(targetDir, features) {
    const p = path.join(targetDir, "src/components/marketing/sections/marketing-footer.tsx");
    let s = await readFile(p, "utf8");
    if (!features.payments) {
        s = s.replace(/\s*\{ href: "\/billing", label: "Billing" \},?\n/, "\n");
    }
    if (!features.aiChat) {
        s = s.replace(/\s*\{ href: "\/chat", label: "Chat" \},?\n/, "\n");
    }
    await writeFile(p, s, "utf8");
}
async function patchMarketingHeaderRemoveBlog(targetDir) {
    const p = path.join(targetDir, "src/components/marketing/marketing-header.tsx");
    let s = await readFile(p, "utf8");
    s = s.replace(/\s*\{ href: "\/blog", label: "Blog" \},?\n/, "\n");
    await writeFile(p, s, "utf8");
}
async function patchRootLayoutKeywords(targetDir, features) {
    const p = path.join(targetDir, "src/app/layout.tsx");
    let s = await readFile(p, "utf8");
    const keywords = ["Next.js", "shadcn", "boilerplate"];
    if (features.auth) {
        keywords.push("Better Auth");
    }
    if (features.database) {
        keywords.push("Prisma");
    }
    if (features.payments) {
        keywords.push("Polar");
    }
    if (features.aiChat) {
        keywords.push("AI SDK");
    }
    const block = `  keywords: [\n${keywords.map((k) => `    "${k}",`).join("\n")}\n  ],`;
    s = s.replace(/  keywords: \[[\s\S]*?\],/, block);
    await writeFile(p, s, "utf8");
}
async function writeManifestAndEnv(targetDir, features) {
    await writeFile(path.join(targetDir, ".templaite.json"), `${JSON.stringify({ version: 1, features }, null, 2)}\n`, "utf8");
    await writeFile(path.join(targetDir, ".env.example"), buildEnvExample(features), "utf8");
}
