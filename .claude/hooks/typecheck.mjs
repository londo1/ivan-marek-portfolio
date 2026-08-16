// PostToolUse hook: typecheck after Claude edits a TS/TSX file.
//
// This project has no test suite, so `tsc --noEmit` is the only automated
// correctness signal. Most of the i18n invariants are encoded in types (a
// dictionary key present in en.ts but missing from bg.ts is a compile error),
// which makes this the cheapest way to catch a broken edit immediately.
//
// Exit 2 feeds stderr back to Claude so it can fix the error in the same turn.

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

let payload = {};
try {
  const raw = await new Promise((res) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => res(data));
    process.stdin.on("error", () => res(""));
  });
  payload = raw ? JSON.parse(raw) : {};
} catch {
  process.exit(0); // Malformed payload — never block the turn over it.
}

const filePath =
  payload?.tool_response?.filePath ?? payload?.tool_input?.file_path ?? "";

// Only TS/TSX edits can break the build; skip CSS, Markdown, JSON, config.
if (!/\.(ts|tsx)$/.test(filePath)) process.exit(0);

const tscBin = join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsc.cmd" : "tsc"
);
if (!existsSync(tscBin)) process.exit(0); // Deps not installed — stay silent.

const result = spawnSync(tscBin, ["--noEmit"], {
  cwd: projectRoot,
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (result.status === 0) process.exit(0);

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
if (!output) process.exit(0);

process.stderr.write(
  `TypeScript errors after editing ${filePath} (npm run typecheck):\n\n${output}\n`
);
process.exit(2);
