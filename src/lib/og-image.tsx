import { createOgImageResponse } from "@/lib/og";
import {
  OG_IMAGE_ALT,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-metadata";

/** Home / global default OG + Twitter image. */
export async function createDefaultOgImage() {
  return createOgImageResponse({
    alt: OG_IMAGE_ALT,
    title: "The boilerplate that still looks like your product",
    subtitle: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  });
}
