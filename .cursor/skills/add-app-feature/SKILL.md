---
name: add-app-feature
description: Scaffold a signed-in app feature—page under (app), optional API route, optional lib and TanStack Query.
---

# Add app feature (scaffold)

## Placement

- **Pages (signed-in)**: under `src/app/(app)/` (same group as dashboard, chat, playground). If the route must require a session, add the path to [middleware.ts](../../../src/middleware.ts) `protectedPrefixes` + `matcher`.
- **Public / marketing**: `src/app/(marketing)/`.
- **Auth flows**: `src/app/(auth)/`.

## Minimal checklist

1. **Server page** (`page.tsx`): default **RSC**; fetch data on server or pass props to a small client child.

2. **Client-only UI** (forms, panels, charts): separate file with `'use client'` (see [chat-panel.tsx](../../../src/app/(app)/chat/chat-panel.tsx)).

3. **API** (if needed): `src/app/api/<name>/route.ts` — typed `NextResponse`, Zod if validating body, no secrets in JSON. Patterns: [chat/route.ts](../../../src/app/api/chat/route.ts), [bootstrap/status](../../../src/app/api/bootstrap/status/route.ts).

4. **Shared logic**: `src/lib/<feature>.ts` (pure functions, server-safe unless marked otherwise).

5. **TanStack Query** (optional): wrap fetches in `src/components/providers.tsx` already has `QueryClientProvider`. Use stable `queryKey` arrays; colocate query hooks with the client module or under `src/lib/queries/` if reused.

6. **Navigation**: add a link from an existing layout or hub (e.g. playground) if the feature is dev-facing.

## Check

- `pnpm exec tsc --noEmit`
- `pnpm lint`
