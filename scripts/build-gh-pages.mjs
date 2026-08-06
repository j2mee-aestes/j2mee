#!/usr/bin/env node
/**
 * Build a static site for GitHub Pages (project site /j2mee/).
 * Temporarily parks server-only routes that cannot be statically exported.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  writeFileSync,
  cpSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const stashRoot = join(root, ".gh-pages-stash");
const appDir = join(root, "src/app");

const parkPaths = [
  "api",
  "admin",
  "activity",
  "my",
  "login",
  "robots.ts",
  "sitemap.ts",
];

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} failed with ${result.status}`);
  }
}

function park() {
  rmSync(stashRoot, { recursive: true, force: true });
  mkdirSync(stashRoot, { recursive: true });
  for (const rel of parkPaths) {
    const from = join(appDir, rel);
    if (!existsSync(from)) continue;
    renameSync(from, join(stashRoot, rel));
    console.log(`parked src/app/${rel}`);
  }
}

function restore() {
  if (!existsSync(stashRoot)) return;
  for (const rel of parkPaths) {
    const stashed = join(stashRoot, rel);
    if (!existsSync(stashed)) continue;
    const dest = join(appDir, rel);
    if (existsSync(dest)) {
      rmSync(dest, { recursive: true, force: true });
    }
    renameSync(stashed, dest);
    console.log(`restored src/app/${rel}`);
  }
  rmSync(stashRoot, { recursive: true, force: true });
}

try {
  park();
  run("npx", ["prisma", "generate"]);
  run("npx", ["next", "build"], {
    GITHUB_PAGES: "1",
    ALLOW_MOCK_DATA: "true",
    NEXT_TELEMETRY_DISABLED: "1",
  });

  const outDir = join(root, "out");
  if (!existsSync(outDir)) {
    throw new Error("out/ missing after static export");
  }
  // GitHub Pages: avoid Jekyll filtering of _next
  writeFileSync(join(outDir, ".nojekyll"), "");
  // Keep a tiny note for operators
  writeFileSync(
    join(outDir, "DEPLOY.txt"),
    "파도파도 static export for GitHub Pages\nURL: https://j2mee-aestes.github.io/j2mee/\n",
  );
  console.log("GitHub Pages export ready in out/");
} finally {
  restore();
}
