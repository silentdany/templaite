<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Package manager

Use **pnpm only** (`pnpm install`, `pnpm add`, `pnpm dlx`, …). The repo declares `packageManager` in `package.json` and `.npmrc` sets `package-manager-strict=true` so mistaken `npm`/`yarn` installs fail fast.
