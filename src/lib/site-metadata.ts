/** Shared copy for layout metadata and OG image generation. */

export const SITE_NAME = "templaite.accura.dev";

export const SITE_DESCRIPTION =
  "Next.js boilerplate with Better Auth, Prisma, Polar, shadcn/ui, and the AI SDK—wired to ship.";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_IMAGE_ALT = `${SITE_NAME} — ${SITE_DESCRIPTION}`;

export function getMetadataBaseUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      /* fall through */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    try {
      return new URL(`https://${vercel}`);
    } catch {
      /* fall through */
    }
  }
  return new URL("http://localhost:3000");
}
