import { describe, expect, it } from "vitest";
import { consumeChatRateLimit } from "./chat-rate-limit";

describe("consumeChatRateLimit", () => {
  it("allows bursts up to the per-window cap", () => {
    const userId = `test-user-${Math.random()}`;
    for (let i = 0; i < 60; i++) {
      expect(consumeChatRateLimit(userId)).toBe(true);
    }
    expect(consumeChatRateLimit(userId)).toBe(false);
  });
});
