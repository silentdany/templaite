import { createOgImageResponse } from "@/lib/og";
import { OG_IMAGE_SIZE, SITE_NAME } from "@/lib/site-metadata";

const alt =
  "Templaite Blog — guides and product notes for the stack (auth, Prisma, Polar, AI).";

export { alt };
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return createOgImageResponse({
    alt,
    kind: "Blog",
    title: "Guides, notes, and changelog",
    subtitle:
      "How we ship with Better Auth, Prisma, Polar, and the AI SDK—patterns you can copy.",
    siteName: SITE_NAME,
  });
}
