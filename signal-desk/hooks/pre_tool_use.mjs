#!/usr/bin/env node
/**
 * PreToolUse hook — defense-in-depth gate.
 *
 * Runs before every tool call. Independently of the settings.json denylist, it:
 *   1. Blocks ALL tool use when a HALT file exists (kill switch).
 *   2. Blocks any tool whose name matches an order/trade/account-mutation
 *      pattern, even if a future settings edit accidentally allows it.
 *
 * Protocol: reads the hook payload as JSON on stdin, prints a JSON decision on
 * stdout. permissionDecision "deny" blocks the call and feeds the reason back
 * to the model.
 * Docs: https://code.claude.com/docs (Hooks reference)
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

// Tool-name fragments that must NEVER execute on this read-only research desk.
const FORBIDDEN = [
  "create_order",
  "delete_order",
  "place_order",
  "cancel_order",
  "modify_order",
  "submit",
  "execute_trade",
];

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

function allow() {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "allow",
      },
    })
  );
  process.exit(0);
}

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  // Malformed payload — fail closed.
  deny("pre_tool_use: could not parse hook payload; failing closed.");
}

// 1. Kill switch.
if (existsSync(resolve(projectDir, "HALT"))) {
  deny("HALT file present — the signal desk is stopped. Run `npm run resume`.");
}

// 2. Hard block on order/trade/account-mutation tools.
const toolName = String(payload.tool_name ?? "").toLowerCase();
if (FORBIDDEN.some((frag) => toolName.includes(frag))) {
  deny(
    `Tool "${payload.tool_name}" is permanently blocked: this desk is read-only ` +
      `and never places, modifies, or cancels orders.`
  );
}

allow();
