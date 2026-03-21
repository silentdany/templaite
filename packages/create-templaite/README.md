# create-templaite

Interactive CLI to copy this repo and **prune** optional integrations (Polar, Resend, Google OAuth, AI chat, Notion blog) or generate a **marketing-only** app without auth/database.

## Usage (from repo root)

```bash
pnpm install
pnpm --filter create-templaite run build
node ./packages/create-templaite/dist/index.js my-app
```

Non-interactive (CI / scripts):

```bash
# Full template (all features enabled — same as DEFAULT_FEATURES in src/features.ts)
node ./packages/create-templaite/dist/index.js --defaults my-app --skip-install

# Minimal marketing site (no Prisma, auth, or integrations)
node ./packages/create-templaite/dist/index.js --defaults --minimal my-app --skip-install
```

Options:

| Flag | Meaning |
|------|---------|
| `--from <path>` | Template root (directory with `package.json` named `templaite`). Defaults to three levels above `dist/` (monorepo root). |
| `--skip-install` | Do not run `pnpm install` after scaffold. |
| `--defaults` | Skip prompts; requires a positional directory name. |
| `--minimal` | With `--defaults`, scaffold without auth/database/integrations. |

The generated project includes `.templaite.json` (feature manifest) and a trimmed `.env.example`.

## Publishing

Add `"create-templaite": "file:./packages/create-templaite"` or publish `create-templaite` to npm so users can run `pnpm dlx create-templaite` (after publishing).
