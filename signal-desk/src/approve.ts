/**
 * The human gate. Run AFTER you've read pending/<date>.md and you're satisfied.
 *
 *   npm run approve -- 2026-06-29
 *
 * It copies the digest to approved/<date>.md and creates a Gmail *draft* (never
 * a send) via the gmail MCP server. Drafting is itself permissioned ("ask" in
 * settings.json), so you confirm once more. Sending the draft is a manual step
 * you do in Gmail — by design.
 */
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "./config.ts";

const day = process.argv[2];
if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
  console.error("Usage: npm run approve -- <YYYY-MM-DD>");
  process.exit(2);
}

const src = resolve(process.cwd(), "pending", `${day}.md`);
if (!existsSync(src)) {
  console.error(`No pending digest at ${src}.`);
  process.exit(2);
}

const digest = readFileSync(src, "utf8");

// Archive as approved.
const approvedDir = resolve(process.cwd(), "approved");
mkdirSync(approvedDir, { recursive: true });
const dst = resolve(approvedDir, `${day}.md`);
writeFileSync(dst, digest.replace("Status: PENDING APPROVAL", "Status: APPROVED"));
console.log(`[signal-desk] approved → ${dst}`);

if (!config.digestRecipient) {
  console.log("[signal-desk] DIGEST_RECIPIENT not set — skipping Gmail draft. (Digest is approved on disk.)");
  process.exit(0);
}

// Create a DRAFT only. We grant exactly one tool for this step.
const draftTool = `mcp__${config.mcp.gmail}__create_draft`;
const prompt =
  `Create a Gmail draft (do NOT send) to ${config.digestRecipient}. ` +
  `Subject: "Signal Desk — ${day}". Body: the Markdown below, verbatim.\n\n${digest}`;

const child = spawn(
  "claude",
  ["-p", prompt, "--model", "claude-haiku-4-5-20251001", "--allowedTools", draftTool, "--max-turns", "3"],
  { stdio: "inherit" }
);
child.on("close", (code) => {
  console.log(
    code === 0
      ? `[signal-desk] Gmail draft created for ${config.digestRecipient}. Review and send it yourself.`
      : `[signal-desk] draft step exited ${code}. The digest is still approved on disk.`
  );
});
