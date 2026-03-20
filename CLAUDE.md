# Claude Code — Templaite

This file is a **short index**. Stack details, commands, and env templates are in **[AGENTS.md](./AGENTS.md)** — read that first when working in this repo.

## Non‑negotiables

- **pnpm only** (`pnpm install`, `pnpm add`, `pnpm dlx`). Never `npm` or `yarn` (enforced by `packageManager` and `.npmrc`).
- **Next.js 16**: this is *not* the Next.js from most training data. Before using App Router APIs or file conventions, read the relevant guide under `node_modules/next/dist/docs/` and heed deprecations (same warning as in AGENTS).
- After substantive edits: **`pnpm check`** (TypeScript + ESLint + Vitest), or at minimum `pnpm exec tsc --noEmit` and `pnpm lint`. CI also runs `pnpm build`.

## Where else to look

| Need | Location |
|------|----------|
| Stack, Prisma, Better Auth, shadcn, AI chat overview | [AGENTS.md](./AGENTS.md) |
| High-level map, middleware, canonical paths | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| **Cursor** project rules (RSC, UI, API, AI chat) | [.cursor/rules/](./.cursor/rules/) — open the rule that matches the files you are editing |
| Repeatable workflows (shadcn add, migrate, feature scaffold) | [.cursor/skills/](./.cursor/skills/) — each folder has a `SKILL.md` |
| Env variable names | [.env.example](./.env.example) |
| Contributing & PR checklist | [CONTRIBUTING.md](./CONTRIBUTING.md), [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) |

## Do not duplicate

Keep AGENTS.md the single long-form stack document. Update AGENTS when stack or commands change; this file should stay a **pointer + invariants** list only.
