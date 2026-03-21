import { cp } from "node:fs/promises";
import path from "node:path";
const IGNORE_TOP_LEVEL = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "coverage",
    "packages",
]);
const IGNORE_FILES = new Set(["pnpm-workspace.yaml", ".pnpm-debug.log"]);
function shouldCopy(templateRoot, src) {
    const rel = path.relative(templateRoot, src);
    if (!rel || rel === "")
        return true;
    const parts = rel.split(path.sep);
    if (parts.some((p) => p === "node_modules" || p === ".git"))
        return false;
    if (parts[0] === "packages")
        return false;
    const base = path.basename(src);
    if (IGNORE_FILES.has(base))
        return false;
    if (IGNORE_TOP_LEVEL.has(base) && parts.length === 1)
        return false;
    return true;
}
export async function copyTemplate(templateRoot, targetDir) {
    await cp(templateRoot, targetDir, {
        recursive: true,
        filter: (src) => shouldCopy(templateRoot, src),
    });
}
