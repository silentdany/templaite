# Contributing

## Prerequisites

- **Node.js** 20+ (CI uses 22)
- **pnpm** only — see [AGENTS.md](./AGENTS.md) and [`.npmrc`](./.npmrc)

## Workflow

1. **Branch** from `main` with a short descriptive name.
2. **One concern per PR** when possible (feature, fix, or docs — not unrelated mixes).
3. **Run checks locally** before opening a PR:

   ```bash
   pnpm check
   ```

   This runs TypeScript, ESLint, and Vitest. CI also runs `pnpm build` with placeholder env vars.

4. **Documentation** — if you change stack behavior, env vars, or canonical file locations:
   - Update [`.env.example`](./.env.example) for new variables (placeholders only).
   - Update [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) if you add a new integration or major route area.
   - Update [`AGENTS.md`](./AGENTS.md) when commands or tooling change.

5. **Secrets** — never commit `.env` or real API keys. See [AGENTS.md](./AGENTS.md) (Secrets section).

## Deployment

See [docs/DEPLOY.md](./docs/DEPLOY.md) for production env and migration notes.

## AI-assisted edits

This repo is optimized for **Cursor** and **Claude**: read [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md) first; follow `.cursor/rules/` and skills when applicable.
