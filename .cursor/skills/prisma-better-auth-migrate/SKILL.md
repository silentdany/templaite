---
name: prisma-better-auth-migrate
description: Regenerate Prisma schema from Better Auth config and apply migrations safely.
---

# Prisma + Better Auth migration

## When to use

- After changing **Better Auth** plugins, providers, or options in [auth.ts](../../../src/lib/auth.ts).

## Do not

- Manually edit **generated** auth models/fields that `better-auth` merges into [schema.prisma](../../../prisma/schema.prisma). Let the CLI merge.

## Steps

1. Ensure `.env` has **`DATABASE_URL`** and **`DIRECT_URL`** (see [AGENTS.md](../../../AGENTS.md), [.env.example](../../../.env.example)).

2. Regenerate schema from auth config:

   ```bash
   pnpm exec better-auth generate --config src/lib/auth.ts -y --output prisma/schema.prisma
   ```

3. Create and apply migration:

   ```bash
   pnpm exec prisma migrate dev --name <describe_change>
   ```

4. Regenerate client (often runs on `postinstall`; safe to run explicitly):

   ```bash
   pnpm exec prisma generate
   ```

## Check

- `pnpm exec tsc --noEmit`
- `pnpm lint`
