import { createOgImageResponse } from "@/lib/og";
import { OG_IMAGE_SIZE, SITE_NAME } from "@/lib/site-metadata";

const alt =
  "Templaite use cases — patterns for shipping auth, billing, and AI together.";

export { alt };
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return createOgImageResponse({
    alt,
    kind: "Use case",
    title: "Real workflows, not toy demos",
    subtitle:
      "From checkout to chat: how teams wire Polar, Better Auth, and the AI SDK in one app.",
    siteName: SITE_NAME,
  });
}
