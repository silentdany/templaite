---
name: add-shadcn-component
description: Add a shadcn/ui component using the project CLI and components.json (base-nova, neutral).
---

# Add shadcn component

## Preconditions

- Run from repo root. Use **pnpm** only.

## Steps

1. **Add the component** (replace `button` with the component name from the registry):

   ```bash
   pnpm dlx shadcn@latest add button
   ```

2. **Verify** [components.json](../../../components.json): aliases should remain `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`.

3. **Import** in app code:

   ```tsx
   import { Button } from "@/components/ui/button";
   import { cn } from "@/lib/utils";
   ```

4. **Styling**: prefer tokens in [globals.css](../../../src/app/globals.css) and existing Tailwind patterns; avoid one-off hex unless extending CSS variables there.

5. **If the component is interactive**, keep it in a client boundary (`'use client'` in the file or import it from a client parent).

## Check

- `pnpm exec tsc --noEmit`
- `pnpm lint`
