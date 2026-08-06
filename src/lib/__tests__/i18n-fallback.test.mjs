import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") flatten(value, path, out);
    else out[path] = value;
  }
  return out;
}

test("non-ko locales have all ko keys", () => {
  const ko = flatten(JSON.parse(readFileSync(join(root, "messages/ko.json"), "utf8")));
  for (const locale of ["en", "ja", "zh-CN"]) {
    const flat = flatten(
      JSON.parse(readFileSync(join(root, `messages/${locale}.json`), "utf8")),
    );
    for (const key of Object.keys(ko)) {
      assert.ok(key in flat, `${locale} missing ${key}`);
    }
  }
});
