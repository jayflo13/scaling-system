#!/usr/bin/env node
/**
 * PostToolUse hook — append-only audit trail.
 *
 * Runs after every tool call and appends one JSON line per call to
 * logs/audit-<YYYY-MM-DD>.jsonl. This is the record of what the desk actually
 * did; never delete it. Inspect with `npm run audit -- <date>`.
 *
 * The hook never blocks (it runs after the fact). On any error it stays silent
 * so logging can't break a run.
 */
import { readFileSync, mkdirSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";

try {
  const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const payload = JSON.parse(readFileSync(0, "utf8") || "{}");

  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const logDir = resolve(projectDir, "logs");
  mkdirSync(logDir, { recursive: true });

  // Keep the input/result compact — log shape and a short preview, not payloads.
  const preview = (v) => {
    const s = typeof v === "string" ? v : JSON.stringify(v ?? null);
    return s.length > 500 ? s.slice(0, 500) + "…[truncated]" : s;
  };

  const entry = {
    ts: now.toISOString(),
    session: payload.session_id ?? null,
    agent: process.env.SIGNAL_DESK_AGENT ?? null,
    tool: payload.tool_name ?? null,
    input: preview(payload.tool_input),
    ok: payload.tool_response?.is_error ? false : true,
    result: preview(payload.tool_response),
  };

  appendFileSync(resolve(logDir, `audit-${day}.jsonl`), JSON.stringify(entry) + "\n");
} catch {
  // Auditing must never break a run; swallow errors.
}
process.exit(0);
