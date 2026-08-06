#!/usr/bin/env node

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");
const locales = ["ko", "en", "ja", "zh-CN"];

const FORBIDDEN = [/못난이/, /ugly\s*seafood/i, /uglyfish/i];

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}

function loadLocale(locale) {
  const raw = readFileSync(join(messagesDir, `${locale}.json`), "utf8");
  return flatten(JSON.parse(raw));
}

const files = readdirSync(messagesDir).filter((f) => f.endsWith(".json"));
const missingFiles = locales.filter((l) => !files.includes(`${l}.json`));
if (missingFiles.length) {
  console.error(`Missing message files: ${missingFiles.join(", ")}`);
  process.exit(1);
}

const maps = Object.fromEntries(locales.map((l) => [l, loadLocale(l)]));
const koKeys = new Set(Object.keys(maps.ko));
let failed = false;

for (const locale of locales.slice(1)) {
  const keys = new Set(Object.keys(maps[locale]));
  const missing = [...koKeys].filter((k) => !keys.has(k)).sort();
  const extra = [...keys].filter((k) => !koKeys.has(k)).sort();
  if (missing.length) {
    failed = true;
    console.error(`[${locale}] missing ${missing.length} keys:`);
    for (const key of missing.slice(0, 40)) console.error(`  - ${key}`);
    if (missing.length > 40) console.error(`  … and ${missing.length - 40} more`);
  }
  if (extra.length) {
    failed = true;
    console.error(`[${locale}] extra ${extra.length} keys:`);
    for (const key of extra.slice(0, 40)) console.error(`  - ${key}`);
  }
}

for (const locale of locales) {
  for (const [key, value] of Object.entries(maps[locale])) {
    if (typeof value !== "string" || value.trim() === "") {
      failed = true;
      console.error(`[${locale}] empty value: ${key}`);
    }
    for (const pattern of FORBIDDEN) {
      if (pattern.test(key) || (typeof value === "string" && pattern.test(value))) {
        failed = true;
        console.error(`[${locale}] forbidden term in ${key}`);
      }
    }
  }
}

if (failed) {
  console.error("\ncheck:i18n failed");
  process.exit(1);
}

console.log(
  `check:i18n passed (${koKeys.size} keys × ${locales.length} locales)`,
);
