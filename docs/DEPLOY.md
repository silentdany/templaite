# Deployment checklist

Use this when shipping to production (e.g. **Vercel** + **Supabase** or any Postgres host). Copy values from [`.env.example`](../.env.example); never commit real secrets.

## 1. Database

1. Create a Postgres instance and obtain:
   - **`DATABASE_URL`** — pooler URL if your host recommends it (e.g. Supabase transaction pooler on port **6543**).
   - **`DIRECT_URL`** — direct/session URL for migrations (often port **5432**), **not** the transaction pooler.
2. From your machine (or CI with `DIRECT_URL`):

   ```bash
   pnpm exec prisma migrate deploy
   ```

   For first-time setup against an empty DB you may use `prisma migrate dev` locally; production should use **`migrate deploy`**.

3. Ensure SSL query params match your provider (e.g. `?sslmode=require`).

## 2. App URL and metadata

Set these in the hosting dashboard to your **public https origin** (no trailing slash):

| Variable | Purpose |
|--------|---------|
| **`NEXT_PUBLIC_APP_URL`** | `metadataBase`, sitemap, robots `Sitemap:` line, OG image absolute URLs |
| **`BETTER_AUTH_URL`** | Better Auth public URL; must match how users reach the site |

Example: `https://your-domain.com`

See also [SEO.md](./SEO.md).

## 3. Auth (Better Auth)

| Variable | Notes |
|----------|--------|
| **`BETTER_AUTH_SECRET`** | Long random string (`openssl rand -base64 32`). Required in production. |
| **`GOOGLE_CLIENT_ID`** / **`GOOGLE_CLIENT_SECRET`** | If using Google sign-in; OAuth redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google` |

## 4. Polar (optional)

If `POLAR_ACCESS_TOKEN` is unset, Polar plugins are not loaded ([`src/lib/auth.ts`](../src/lib/auth.ts)).

| Variable | Notes |
|----------|--------|
| `POLAR_ACCESS_TOKEN` | API token from Polar |
| `POLAR_SERVER` | `production` or `sandbox` |
| `POLAR_WEBHOOK_SECRET` | For verifying webhooks |
| `POLAR_CHECKOUT_PRODUCT_ID` / `POLAR_CHECKOUT_SLUG` | Both required to enable checkout in the auth config |

**Webhooks:** In Polar, set the webhook URL to:

`{BETTER_AUTH_URL}/api/auth/polar/webhooks`

(e.g. `https://your-domain.com/api/auth/polar/webhooks`). Handlers are registered when `POLAR_WEBHOOK_SECRET` is set.

## 5. Email (Resend, optional)

Set `RESEND_API_KEY` and `EMAIL_FROM` if you use verification or password reset email. Verify your domain in Resend for production.

## 6. AI chat (optional)

Set `AI_GATEWAY_API_KEY` (Vercel AI Gateway) and/or `OPENAI_API_KEY` per [`.env.example`](../.env.example).

## 7. Notion blog (optional)

Set `NOTION_TOKEN` and `NOTION_BLOG_DATABASE_ID`; share the database with your integration. See [BLOG_NOTION.md](./BLOG_NOTION.md).

## 8. Post-deploy smoke checks

- [ ] `/` loads over HTTPS  
- [ ] Sign up / sign in (and Google if enabled)  
- [ ] `/api/auth` routes respond (no 5xx from misconfigured `BETTER_AUTH_URL`)  
- [ ] `/sitemap.xml` and `/robots.txt` show correct absolute URLs  
- [ ] If Polar enabled: test checkout or portal once in sandbox/production as appropriate  

## CI

Pull requests run [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (typecheck, lint, tests, build). Production deploy should still use real env vars in the host; CI uses placeholder DB URLs only to compile the app.
