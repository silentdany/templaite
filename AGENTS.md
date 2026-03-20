<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Package manager

Use **pnpm only** (`pnpm install`, `pnpm add`, `pnpm dlx`, …). The repo declares `packageManager` in `package.json` and `.npmrc` sets `package-manager-strict=true` so mistaken `npm`/`yarn` installs fail fast.

## Stack (this repo)

- **Next.js 16** App Router under `src/app/`
- **Prisma 7** + Postgres: `prisma.config.ts` uses `DIRECT_URL` / `DATABASE_URL` for CLI; runtime uses `DATABASE_URL` + `@prisma/adapter-pg` in `src/lib/prisma.ts`
- **Better Auth** + `@better-auth/prisma-adapter`: `src/lib/auth.ts`, `src/app/api/auth/[...all]/route.ts`
- **Polar** (optional): `@polar-sh/better-auth` in `src/lib/auth.ts`; webhooks at `/api/auth/polar/webhooks`
- **TanStack Query**: `src/components/providers.tsx` wraps the root layout
- **shadcn/ui** (Tailwind v4): `components.json`, `src/components/ui/*`
- **AI SDK** + OpenAI: `src/app/api/chat/route.ts`, chat UI under `(app)/chat`

## Commands

```bash
pnpm install
pnpm exec prisma generate
pnpm exec better-auth generate --config src/lib/auth.ts -y --output prisma/schema.prisma
pnpm exec prisma migrate dev   # requires DIRECT_URL / reachable DB
pnpm dev
```

## Better Auth / Prisma schema

After changing Better Auth plugins or options, re-run `better-auth generate` and create a migration. **Do not manually edit** generated auth tables in `schema.prisma` — let the CLI merge changes.

## Env templates

See `.env.example` for `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_*`, optional `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, optional `RESEND_API_KEY` / `EMAIL_FROM`, Polar, AI chat (`AI_GATEWAY_API_KEY` and/or `OPENAI_API_KEY`), optional Notion blog (`NOTION_TOKEN`, `NOTION_BLOG_DATABASE_ID` — see [docs/BLOG_NOTION.md](./docs/BLOG_NOTION.md)). Set **`NEXT_PUBLIC_APP_URL`** in production for correct sitemap/OG/canonical URLs ([docs/SEO.md](./docs/SEO.md)).

## AI assistants (Cursor & Claude)

- **Claude Code**: start from root [`CLAUDE.md`](./CLAUDE.md) — indexes this file, Cursor rules, skills, and architecture map.
- **Cursor**: project rules in [`.cursor/rules/`](./.cursor/rules/) (`.mdc` files; always-apply + file-scoped).
- **Workflow skills**: [`.cursor/skills/`](./.cursor/skills/) — each subfolder has a `SKILL.md` (e.g. shadcn add, Prisma + Better Auth migrate, app feature scaffold).
- **Architecture map**: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — middleware, route groups, canonical file table.
