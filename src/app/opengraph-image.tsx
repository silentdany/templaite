import { createDefaultOgImage } from "@/lib/og-image";
import { OG_IMAGE_ALT, OG_IMAGE_SIZE } from "@/lib/site-metadata";

export const alt = OG_IMAGE_ALT;
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return createDefaultOgImage();
}
