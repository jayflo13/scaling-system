/**
 * Pretty-print the audit trail for a day.
 *   npm run audit -- 2026-06-29
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const day = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? new Date().toISOString().slice(0, 10);
const file = resolve(process.cwd(), "logs", `audit-${day}.jsonl`);

if (!existsSync(file)) {
  console.error(`No audit log for ${day} at ${file}.`);
  process.exit(2);
}

const lines = readFileSync(file, "utf8").split("\n").filter(Boolean);
console.log(`Audit ${day} — ${lines.length} tool calls\n`);
for (const line of lines) {
  try {
    const e = JSON.parse(line);
    const status = e.ok ? "ok " : "ERR";
    console.log(`${e.ts}  [${status}]  ${e.agent ?? "?"} → ${e.tool}`);
    console.log(`    in:  ${e.input}`);
  } catch {
    console.log("  (unparseable line)");
  }
}
