import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Block crawlers from app shell, APIs, and checkout; allow public marketing + blog.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/account",
        "/billing",
        "/chat",
        "/playground",
        "/checkout",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
