import { describe, expect, it } from "vitest";
import { markdownToPlainExcerpt } from "./markdown-excerpt";

describe("markdownToPlainExcerpt", () => {
  it("returns empty string for empty input", () => {
    expect(markdownToPlainExcerpt("")).toBe("");
  });

  it("strips heading markers and keeps readable text", () => {
    const out = markdownToPlainExcerpt("# Hello\n\nFirst paragraph of the post.");
    expect(out).toContain("Hello");
    expect(out).toContain("First paragraph");
  });

  it("truncates long content with ellipsis", () => {
    const long = "word ".repeat(100);
    const out = markdownToPlainExcerpt(long, 50);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(51);
  });
});
