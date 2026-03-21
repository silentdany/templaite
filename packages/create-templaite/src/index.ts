#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import { copyTemplate } from "./copy.js";
import {
  DEFAULT_FEATURES,
  featuresFromPrompts,
  validateFeatures,
} from "./features.js";
import { pruneProject } from "./prune.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveDefaultTemplateRoot(): string {
  return path.join(__dirname, "../../..");
}

function parseArgs(argv: string[]): {
  targetName: string | null;
  from: string | null;
  skipInstall: boolean;
  defaults: boolean;
  minimal: boolean;
} {
  const rest = argv.slice(2);
  let skipInstall = false;
  let defaults = false;
  let minimal = false;
  let from: string | null = null;
  const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--skip-install") {
      skipInstall = true;
      continue;
    }
    if (a === "--defaults") {
      defaults = true;
      continue;
    }
    if (a === "--minimal") {
      minimal = true;
      continue;
    }
    if (a === "--from" && rest[i + 1]) {
      from = rest[i + 1];
      i++;
      continue;
    }
    if (a.startsWith("-")) {
      continue;
    }
    positional.push(a);
  }
  return {
    targetName: positional[0] ?? null,
    from,
    skipInstall,
    defaults,
    minimal,
  };
}

async function run(): Promise<void> {
  const args = parseArgs(process.argv);

  if (args.defaults) {
    await runNonInteractive(args);
    return;
  }

  p.intro("create-templaite");

  let templateRoot = args.from ?? resolveDefaultTemplateRoot();
  const pkgPath = path.join(templateRoot, "package.json");
  if (!existsSync(pkgPath)) {
    const next = await p.text({
      message: "Path to Templaite template (repo root with package.json)",
      placeholder: templateRoot,
      initialValue: templateRoot,
    });
    if (p.isCancel(next)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    templateRoot = next;
  }

  const pkgRaw = await readFile(path.join(templateRoot, "package.json"), "utf8");
  const pkg = JSON.parse(pkgRaw) as { name?: string };
  if (pkg.name !== "templaite") {
    const ok = await p.confirm({
      message: `package.json name is "${pkg.name ?? "unknown"}" — continue anyway?`,
      initialValue: false,
    });
    if (p.isCancel(ok) || !ok) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
  }

  let projectName =
    args.targetName ??
    (await p.text({
      message: "Project directory name",
      placeholder: "my-app",
      validate: (v) => {
        if (!v.trim()) return "Required";
        return undefined;
      },
    }));
  if (p.isCancel(projectName)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }
  projectName = String(projectName).trim();

  const targetDir = path.resolve(process.cwd(), projectName);
  if (existsSync(targetDir)) {
    p.log.error(`Target already exists: ${targetDir}`);
    process.exit(1);
  }

  const authWithDatabase = await p.confirm({
    message: "Include Postgres + Prisma + Better Auth (signed-in app area)?",
    initialValue: true,
  });
  if (p.isCancel(authWithDatabase)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  let payments = false;
  let resend = false;
  let googleOAuth = false;
  if (authWithDatabase) {
    const pay = await p.confirm({
      message: "Include Polar (payments / billing / webhooks)?",
      initialValue: true,
    });
    if (p.isCancel(pay)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    payments = Boolean(pay);

    const rs = await p.confirm({
      message: "Include Resend (verification + password reset emails)?",
      initialValue: true,
    });
    if (p.isCancel(rs)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    resend = Boolean(rs);

    const go = await p.confirm({
      message: "Include Google OAuth (optional; still needs env when enabled)?",
      initialValue: true,
    });
    if (p.isCancel(go)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }
    googleOAuth = Boolean(go);
  }

  const ai = await p.confirm({
    message: "Include AI SDK streaming chat (/chat + /api/chat)?",
    initialValue: true,
  });
  if (p.isCancel(ai)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const nb = await p.confirm({
    message: "Include Notion-backed blog (/blog)?",
    initialValue: true,
  });
  if (p.isCancel(nb)) {
    p.cancel("Cancelled.");
    process.exit(0);
  }

  const features = featuresFromPrompts({
    authWithDatabase: Boolean(authWithDatabase),
    payments,
    resend,
    googleOAuth,
    aiChat: Boolean(ai),
    notionBlog: Boolean(nb),
  });

  const err = validateFeatures(features);
  if (err) {
    p.log.error(err);
    process.exit(1);
  }

  const spin = p.spinner();
  spin.start("Copying template…");
  await copyTemplate(templateRoot, targetDir);
  spin.stop("Template copied.");

  spin.start("Applying feature selection…");
  await pruneProject(targetDir, features);
  spin.stop("Features applied.");

  if (!args.skipInstall) {
    spin.start("Installing dependencies (pnpm)…");
    try {
      execSync("pnpm install", { cwd: targetDir, stdio: "inherit" });
    } catch {
      p.log.warn("pnpm install failed — run `pnpm install` inside the project.");
    }
    spin.stop("Install step finished.");
  }

  p.outro(`Done. Next:\n  cd ${projectName}\n  cp .env.example .env\n  pnpm dev`);
}

async function runNonInteractive(args: ReturnType<typeof parseArgs>): Promise<void> {
  const projectName = args.targetName;
  if (!projectName?.trim()) {
    console.error(
      "Usage: create-templaite --defaults <dir> [--minimal] [--from <template>] [--skip-install]",
    );
    process.exit(1);
  }

  const templateRoot = args.from ?? resolveDefaultTemplateRoot();
  if (!existsSync(path.join(templateRoot, "package.json"))) {
    console.error(`Invalid template root: ${templateRoot}`);
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName.trim());
  if (existsSync(targetDir)) {
    console.error(`Target already exists: ${targetDir}`);
    process.exit(1);
  }

  const features = args.minimal
    ? {
        database: false,
        auth: false,
        payments: false,
        resend: false,
        googleOAuth: false,
        aiChat: false,
        notionBlog: false,
      }
    : DEFAULT_FEATURES;
  const err = validateFeatures(features);
  if (err) {
    console.error(err);
    process.exit(1);
  }

  await copyTemplate(templateRoot, targetDir);
  await pruneProject(targetDir, features);

  if (!args.skipInstall) {
    execSync("pnpm install", { cwd: targetDir, stdio: "inherit" });
  }

  console.log(`Scaffolded ${targetDir}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
