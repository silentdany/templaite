import type { TemplaiteFeatures } from "./features.js";

export function filterPackageJson(
  pkg: Record<string, unknown>,
  f: TemplaiteFeatures,
): Record<string, unknown> {
  const next = { ...pkg } as Record<string, unknown>;
  const deps = {
    ...((next.dependencies as Record<string, string>) ?? {}),
  };
  const devDeps = {
    ...((next.devDependencies as Record<string, string>) ?? {}),
  };

  function remove(key: string) {
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
    ...((next.scripts as Record<string, string>) ?? {}),
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
