import { ImageResponse } from "next/og";
import { getOgImageFonts, OG_MARKETING_FONT_FAMILY } from "@/lib/og/fonts";
import type { OgImageTemplateProps } from "@/lib/og/types";
import { OG_IMAGE_SIZE, SITE_NAME } from "@/lib/site-metadata";

const MAX_TITLE = 72;
const MAX_SUBTITLE = 140;

/** Hero-aligned grid + soft blobs (approximates `hero-section` marketing background). */
const OG_BACKGROUND_LAYERS = [
  "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px)",
  "linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
  "radial-gradient(ellipse 70% 60% at 12% 8%, rgba(99,102,241,0.18), transparent 55%)",
  "radial-gradient(ellipse 65% 55% at 92% 88%, rgba(249,115,22,0.14), transparent 55%)",
  "linear-gradient(180deg, #fafafa 0%, #f4f4f5 55%, #fafafa 100%)",
].join(", ");

const BG_SIZE = "64px 64px, 64px 64px, auto, auto, auto";

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Matches [`BrandWordmark`](@/components/brand-wordmark.tsx): `templ` + `ai` pill + `te`.
 */
function OgWordmark({ scale = 1 }: { scale?: number }) {
  const s = 44 * scale;
  const pill = 0.88 * s;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        letterSpacing: "-0.04em",
      }}
    >
      <span style={{ fontSize: s, fontWeight: 600, color: "#171717" }}>templ</span>
      <span
        style={{
          display: "flex",
          marginLeft: 6,
          marginRight: 6,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 6,
          paddingBottom: 6,
          borderRadius: 6,
          background: "#171717",
          color: "#fafafa",
          fontSize: pill,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        ai
      </span>
      <span style={{ fontSize: s, fontWeight: 600, color: "#171717" }}>te</span>
    </div>
  );
}

function OgImageInner(props: OgImageTemplateProps) {
  const site = props.siteName ?? SITE_NAME;
  const title = truncate(props.title, MAX_TITLE);
  const subtitle = props.subtitle
    ? truncate(props.subtitle, MAX_SUBTITLE)
    : undefined;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        fontFamily: OG_MARKETING_FONT_FAMILY,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#fafafa",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: OG_BACKGROUND_LAYERS,
          backgroundSize: BG_SIZE,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 64,
          paddingTop: 72,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <OgWordmark scale={1.05} />
          {props.kind ? (
            <div
              style={{
                display: "flex",
                marginTop: 36,
              }}
            >
              <span
                style={{
                  display: "flex",
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(0,0,0,0.04)",
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 6,
                  paddingBottom: 6,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#525252",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase" as const,
                }}
              >
                {truncate(props.kind, 28)}
              </span>
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              marginTop: props.kind ? 20 : 40,
              fontSize: 52,
              fontWeight: 700,
              color: "#171717",
              lineHeight: 1.12,
              letterSpacing: "-0.045em",
              maxWidth: 980,
            }}
          >
            <span>{title}</span>
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                marginTop: 20,
                fontSize: 26,
                fontWeight: 400,
                color: "#737373",
                lineHeight: 1.35,
                maxWidth: 920,
                letterSpacing: "-0.02em",
              }}
            >
              <span>{subtitle}</span>
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            paddingTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#a3a3a3",
              letterSpacing: "-0.02em",
            }}
          >
            {site}
          </span>
        </div>
      </div>
    </div>
  );
}

export async function createOgImageResponse(
  props: OgImageTemplateProps,
): Promise<ImageResponse> {
  const fonts = await getOgImageFonts();
  return new ImageResponse(<OgImageInner {...props} />, {
    ...OG_IMAGE_SIZE,
    fonts,
  });
}
