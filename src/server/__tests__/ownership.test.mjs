import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";

const localeSchema = z.enum(["ko", "en", "ja", "zh-CN"]);
const schedulePayloadSchema = z
  .object({
    id: z.string().min(1).max(120),
    title: z.string().min(1).max(200),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.string().min(1).max(40),
    items: z.array(z.unknown()).max(50),
  })
  .passthrough();

test("rejects invalid locale", () => {
  assert.equal(localeSchema.safeParse("fr").success, false);
  assert.equal(localeSchema.safeParse("ko").success, true);
});

test("rejects invalid schedule payload", () => {
  const result = schedulePayloadSchema.safeParse({
    id: "s1",
    title: "",
    date: "bad",
    status: "draft",
    items: [],
  });
  assert.equal(result.success, false);
});

test("accepts minimal valid schedule payload", () => {
  const result = schedulePayloadSchema.safeParse({
    id: "s1",
    title: "바다 하루",
    date: "2026-08-06",
    status: "draft",
    items: [],
  });
  assert.equal(result.success, true);
});
