import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Matches [`Syne`](@/app/(marketing)/layout.tsx) used for marketing headings. */
export const OG_MARKETING_FONT_FAMILY = "Syne";

/** Static Latin `.woff` files from `@fontsource/syne` — Satori handles these reliably (variable TTFs often crash). */
const SYNE_FILES_DIR = join(
  process.cwd(),
  "node_modules/@fontsource/syne/files",
);

const WEIGHTS = [400, 600, 700] as const;

const syneByWeight = new Map<
  (typeof WEIGHTS)[number],
  Promise<ArrayBuffer>
>();

function bufferToArrayBuffer(buf: Buffer): ArrayBuffer {
  return new Uint8Array(buf).buffer;
}

function loadSyneLatinWoff(weight: (typeof WEIGHTS)[number]): Promise<ArrayBuffer> {
  const existing = syneByWeight.get(weight);
  if (existing) return existing;
  const path = join(SYNE_FILES_DIR, `syne-latin-${weight}-normal.woff`);
  const promise = readFile(path).then(bufferToArrayBuffer);
  syneByWeight.set(weight, promise);
  return promise;
}

/**
 * Cached Syne faces for `@vercel/og` / Satori (same family as the landing page wordmark).
 */
export async function getOgImageFonts() {
  const fonts = await Promise.all(
    WEIGHTS.map(async (weight) => ({
      name: OG_MARKETING_FONT_FAMILY,
      data: await loadSyneLatinWoff(weight),
      style: "normal" as const,
      weight: weight as 400 | 600 | 700,
    })),
  );
  return fonts;
}
