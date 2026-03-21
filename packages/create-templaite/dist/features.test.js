import { describe, expect, it } from "vitest";
import { validateFeatures } from "./features.js";
describe("validateFeatures", () => {
    it("rejects auth without database", () => {
        expect(validateFeatures({
            database: false,
            auth: true,
            payments: false,
            resend: false,
            googleOAuth: false,
            aiChat: false,
            notionBlog: false,
        })).toBeTruthy();
    });
    it("accepts full defaults", () => {
        expect(validateFeatures({
            database: true,
            auth: true,
            payments: true,
            resend: true,
            googleOAuth: true,
            aiChat: true,
            notionBlog: true,
        })).toBeNull();
    });
});
