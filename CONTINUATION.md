# Boilerplate handoff — resume here

This file tracks **actual progress** on the open-source stack (Next.js, Supabase/Prisma 7, Better Auth, Polar, shadcn, TanStack Query, AI SDK, etc.). Commit this file with your WIP branch so you can pick up later.

Reference spec (do not edit that file): plan **OSS Next.js boilerplate** — `.cursor/plans/oss_next.js_boilerplate_17103c5b.plan.md` (or your synced copy).

---

## Done so far

| Area | Status |
|------|--------|
| Next.js 16 App Router + `src/` | Yes (default `create-next-app` pages only) |
| **pnpm only** | `packageManager` in `package.json`, `.npmrc` (`package-manager-strict`), `README` / `AGENTS.md` / `CLAUDE.md` |
| Core dependencies | Listed in `package.json`: Better Auth, `@polar-sh/better-auth`, AI SDK + OpenAI, TanStack Query, RHF + Zod, Motion, Geist pkg, Lucide, CVA, clsx, tailwind-merge, `pg`, `@prisma/adapter-pg`, `dotenv` |
| Prisma 7 scaffold | `prisma/schema.prisma` (generator → `src/generated/prisma`, PostgreSQL datasource block only — URLs live in config) |
| `prisma.config.ts` | **CLI URL** = `DIRECT_URL` → `DATABASE_URL` → local placeholder. Intended: **direct Supabase session (5432)** for migrate; **runtime** should use **pooled** `DATABASE_URL` in app code (see below) |
| Dev deps | `prisma`, `@better-auth/cli`, `tw-animate-css` |

---

## Not done yet (in rough order)

1. **`pnpm approve-builds`** (if prompted) — Prisma/sharp native installs were blocked by pnpm script policy in this environment.
2. **`pnpm exec prisma generate`** — Must succeed so `src/generated/prisma` exists. **Folder is gitignored**; every clone runs `generate` after install.
3. **`src/lib/prisma.ts`** — `PrismaClient` from generated path + `PrismaPg` adapter using **`process.env.DATABASE_URL`** (pooled). Do **not** use `DIRECT_URL` for the pool in production.
4. **`src/lib/auth.ts` + `src/app/api/auth/[...all]/route.ts`** — `betterAuth` + `prismaAdapter`, `emailAndPassword`, optional `nextCookies()` from `better-auth/next-js`.
5. **`pnpm exec better-auth generate`** (or migrate) — Merge Better Auth (and Polar if required) models into `prisma/schema.prisma`; re-run whenever plugins change.
6. **`pnpm exec prisma migrate dev`** — After schema is complete, with real `DIRECT_URL` in `.env`.
7. **Polar** — `polar()`, `checkout` / `portal` / `webhooks` in server config; `polarClient()` on `createAuthClient`; webhook path per Polar docs (`/polar/webhooks` etc.).
8. **shadcn/ui** — `pnpm dlx shadcn@latest init` (Tailwind v4 paths under `src/`).
9. **TanStack Query** — `src/components/providers.tsx` + wrap root `layout`.
10. **Routes** — `(marketing)/`, `(auth)/login` + `signup`, `(app)/dashboard` + `chat`, middleware for `/dashboard`, `/chat`.
11. **`src/app/api/demo/*` + `src/app/api/chat/route.ts`** — Demo JSON + streaming chat; gate UI if `OPENAI_API_KEY` missing.
12. **Docs** — `.env.example`, expanded `README`, `LICENSE`, fill `AGENTS.md` with stack + commands + “don’t hand-edit Better Auth tables”.

---

## Environment variables to document (`.env.example`)

- `DATABASE_URL` — Supabase **pooler** (runtime, `@prisma/adapter-pg`).
- `DIRECT_URL` — Supabase **direct** (migrations / Prisma CLI).
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET` (+ checkout product IDs when you add them)
- `OPENAI_API_KEY` (or gateway key) for AI chat

---

## Known issues / notes

- **`@better-auth/cli` (1.4.x)** vs **`better-auth` (1.5.x)** — pnpm reports a peer mismatch on `better-call`. Watch for CLI bugs; consider pinning/upgrading when upstream publishes a matching CLI.
- **Prisma 7** — No `url`/`directUrl` in `schema.prisma`; driver adapter required in application code. Upgrade doc: [Prisma 7 upgrade guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7).

---

## Quick resume commands

```bash
pnpm install
# copy .env.example → .env and fill URLs/secrets
pnpm exec prisma generate
pnpm exec better-auth generate   # after auth.ts exists
pnpm exec prisma migrate dev
pnpm dev
```

Delete this file or trim it once the boilerplate matches the main README.
