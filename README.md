# Templaite

Open-source Next.js **App Router** starter: **pnpm**, **Prisma 7** (Postgres + driver adapter), **Better Auth** (email/password), optional **Polar** (checkout, portal, webhooks), **TanStack Query**, **shadcn/ui** (Tailwind v4), and **AI SDK** streaming chat.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (required; `packageManager` is pinned in `package.json`)
- Postgres (e.g. Supabase): pooled URL for the app, direct URL for migrations

## Scaffold with the CLI (optional)

From a clone of this repo, build and run the local CLI to create a **new directory** with selected features (or a minimal marketing-only app):

```bash
pnpm install
pnpm --filter create-templaite run build
node ./packages/create-templaite/dist/index.js my-app
```

Non-interactive examples: `node ./packages/create-templaite/dist/index.js --defaults my-app --skip-install` (full features) or `--defaults --minimal my-app` (no auth/DB). See [packages/create-templaite/README.md](packages/create-templaite/README.md).

## Setup

```bash
pnpm install
cp .env.example .env
```

Fill `.env` (see comments in [.env.example](.env.example)). Then:

```bash
pnpm exec prisma generate
pnpm exec prisma migrate deploy   # or `migrate dev` against DIRECT_URL
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase: `P1001` / “Can’t reach database server”

Prisma CLI reads **`DIRECT_URL`** from [.env.example](.env.example) (via [prisma.config.ts](prisma.config.ts)). Check the following:

1. **Use the right URI** — In Supabase: **Project Settings → Database**. For `migrate dev`, use **Session mode** or **Direct connection** (port **5432**). Do not use the **Transaction pooler** (port 6543) for migrations.
2. **SSL** — Append `?sslmode=require` if it is not already in the URI.
3. **Project not paused** — On the free tier, open the dashboard and **restore** the project if it was paused.
4. **Network** — Corporate VPNs, firewalls, or some WSL2/DNS setups block outbound **5432**. Try another network, disable VPN briefly, or from WSL run `nc -zv db.<project-ref>.supabase.co 5432` to see if the port is reachable.
5. **Password** — If you hand-typed the URI, special characters in the password must be **URL-encoded**. Prefer copying the full connection string from the Supabase UI.

### First-time Prisma client

Generated output is gitignored at `src/generated/prisma`. After install, `postinstall` runs `prisma generate`. On a clean clone, run `pnpm exec prisma generate` if needed.

### Better Auth schema

Auth models live in [prisma/schema.prisma](prisma/schema.prisma). If you change Better Auth plugins or options, regenerate:

```bash
pnpm exec better-auth generate --config src/lib/auth.ts -y --output prisma/schema.prisma
pnpm exec prisma migrate dev
```

**Do not hand-edit** Better Auth–managed tables; re-run the CLI instead.

### Google OAuth (optional)

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add authorized redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google` (e.g. `http://localhost:3000/api/auth/callback/google` in dev).
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.

When both are set, login and signup show **Continue with Google** (Better Auth `socialProviders.google`).

### Resend (email)

Optional: set `RESEND_API_KEY` and `EMAIL_FROM` to enable **verification emails** on sign-up and **password reset** (`/forgot-password` → `/reset-password`). Uses [Resend](https://resend.com); for quick tests you can send from `onboarding@resend.dev` with the default `EMAIL_FROM` shown in [.env.example](.env.example).

**Playground:** when signed in, `/playground` can call `POST /api/test/resend` to send a single message to your account email. That route is allowed in **development** by default; in production set `ALLOW_TEST_EMAIL=true` (still requires a valid session).

If the route fails, the JSON body includes Resend’s **`error` text** (and optional **`code`**). A valid API key is not enough: **`EMAIL_FROM` must use a [verified domain](https://resend.com/docs/dashboard/domains/introduction) in Resend**, or use `onboarding@resend.dev` for quick tests (see `.env.example`).

If either variable is missing, Better Auth keeps email/password and Google sign-in, but verification and reset emails are not sent.

### Polar

- Set `POLAR_ACCESS_TOKEN` (and optionally `POLAR_SERVER=sandbox`) to enable the Polar plugin.
- Configure the Polar webhook URL to: `{BETTER_AUTH_URL}/api/auth/polar/webhooks` (e.g. `https://your-domain.com/api/auth/polar/webhooks`).
- Set `POLAR_WEBHOOK_SECRET` to register the webhooks plugin with signature verification.
- Optional: `POLAR_CHECKOUT_PRODUCT_ID` + `POLAR_CHECKOUT_SLUG` enable the checkout plugin.

### AI chat

Prefer **[Vercel AI Gateway](https://vercel.com/docs/ai-gateway)**: set `AI_GATEWAY_API_KEY`. Optionally override the model with `AI_GATEWAY_MODEL` (default `openai/gpt-4o-mini`).

Fallback: set `OPENAI_API_KEY` for direct OpenAI via `@ai-sdk/openai` (optional `OPENAI_CHAT_MODEL`, default `gpt-4o-mini`). If both are set, **the gateway key wins**.

`GET /api/chat` returns `{ chatEnabled, aiProvider: "gateway" | "openai" | "none" }` without revealing secrets. **`POST /api/chat`** requires a signed-in session (same cookies as the app) and applies a per-user rate limit—unauthenticated callers get `401`.

### Bootstrap / Playground

After signing in, use these routes to exercise the stack:

| Route | Purpose |
|--------|---------|
| `/playground` | Hub: integration flags, TanStack Query smoke calls to demo/chat/bootstrap APIs, Resend test (`POST /api/test/resend`), links to other test pages |
| `/account` | JSON session via `authClient.useSession()` |
| `/billing` | Polar: checkout (slug / product id), customer portal, customer state, list endpoints |

`GET /api/bootstrap/status` returns **non-secret** flags (`chatEnabled`, `aiProvider`, Polar readiness booleans, etc.). **`polarCheckoutSlug`** and **`polarCheckoutProductId`** are included only when the request has a valid session cookie so anonymous visitors cannot scrape checkout identifiers; sign in to use Polar checkout from the billing page or marketing pricing (when logged in).

Polar webhook URL (unchanged): `{BETTER_AUTH_URL}/api/auth/polar/webhooks`.

## Scripts

| Command | Purpose |
|--------|---------|
| `pnpm dev` | Next.js dev server |
| `pnpm build` / `pnpm start` | Production build & run |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest (unit tests) |
| `pnpm check` | Typecheck + lint + tests (same gates as CI except `build`) |
| `pnpm exec prisma …` | Prisma CLI (uses [prisma.config.ts](prisma.config.ts) for `DIRECT_URL` / fallbacks) |

## Project layout

- [src/lib/prisma.ts](src/lib/prisma.ts) — Prisma client with `@prisma/adapter-pg` and **`DATABASE_URL`** (pooled at runtime).
- [src/lib/auth.ts](src/lib/auth.ts) — Better Auth server config (Polar optional).
- [src/lib/auth-client.ts](src/lib/auth-client.ts) — Better Auth React client + `polarClient()`.
- [src/app/api/auth/[...all]/route.ts](src/app/api/auth/[...all]/route.ts) — Auth HTTP handler.
- Route groups: `(marketing)`, `(auth)`, `(app)`; [`src/proxy.ts`](src/proxy.ts) (Next.js 16 proxy) protects `/dashboard`, `/chat`, `/playground`, `/account`, and `/billing`.

## Docs for agents

See [AGENTS.md](AGENTS.md) for package-manager rules and Next.js version notes. Contributing: [CONTRIBUTING.md](CONTRIBUTING.md). Deploy: [docs/DEPLOY.md](docs/DEPLOY.md).

## License

[MIT](LICENSE).
