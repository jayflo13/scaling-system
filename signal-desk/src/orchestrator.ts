/**
 * Orchestrator — one daily research cycle.
 *
 *   preflight (HALT? budget?) ─▶ run each read-only specialist (cheap models)
 *     ─▶ compile + rank with Opus ─▶ write digest to pending/<date>.md (GATED)
 *
 * Nothing here sends or publishes. The digest sits in pending/ until a human
 * runs `npm run approve -- <date>`. Each specialist is spawned as a separate
 * `claude` process with a least-privilege --allowedTools list; the project
 * .claude/settings.json supplies the denylist + Pre/PostToolUse hooks.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { config, MODEL_ID, SPECIALISTS, COMPILER, type Model } from "./config.ts";
import { canSpend, record, remaining, spentToday } from "./budget.ts";

const HALT = resolve(process.cwd(), "HALT");

interface RunResult {
  text: string;
  costUsd: number;
  isError: boolean;
}

/** Spawn one `claude` run in print/JSON mode. Resolves with text + cost. */
function runClaude(opts: {
  agentId: string;
  model: Model;
  allowedTools: string[];
  prompt: string;
  systemPrompt: string;
}): Promise<RunResult> {
  return new Promise((resolvePromise) => {
    const args = [
      "-p",
      opts.prompt,
      "--output-format",
      "json",
      "--model",
      MODEL_ID[opts.model],
      "--max-turns",
      String(config.maxTurns),
      "--append-system-prompt",
      opts.systemPrompt,
    ];
    if (opts.allowedTools.length) {
      args.push("--allowedTools", opts.allowedTools.join(","));
    }

    const child = spawn("claude", args, {
      env: { ...process.env, SIGNAL_DESK_AGENT: opts.agentId },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", () => {
      try {
        const json = JSON.parse(out);
        resolvePromise({
          text: String(json.result ?? ""),
          costUsd: Number(json.total_cost_usd ?? 0),
          isError: Boolean(json.is_error),
        });
      } catch {
        resolvePromise({ text: `[${opts.agentId}] no parseable output. stderr: ${err.slice(0, 300)}`, costUsd: 0, isError: true });
      }
    });
  });
}

const ROLE_PREAMBLE =
  "Follow CLAUDE.md exactly. You are read-only: never place, modify, or cancel " +
  "orders, and never send or publish anything. Return only the JSON your task " +
  "specifies.";

async function main(): Promise<void> {
  const day = new Date().toISOString().slice(0, 10);
  console.log(`[signal-desk] cycle ${day} | watchlist: ${config.watchlist.join(", ")}`);

  // --- Preflight gates -----------------------------------------------------
  const { existsSync } = await import("node:fs");
  if (existsSync(HALT)) {
    console.error("[signal-desk] HALT file present — aborting. Run `npm run resume`.");
    process.exit(3);
  }
  if (!canSpend()) {
    console.error(`[signal-desk] daily cap $${config.dailyUsdCap} already reached ($${spentToday().toFixed(2)}). Aborting.`);
    process.exit(4);
  }

  // --- Gather (cheap, read-only specialists) -------------------------------
  const notes: { title: string; body: string }[] = [];
  for (const s of SPECIALISTS) {
    if (existsSync(HALT)) { console.error("[signal-desk] HALT mid-cycle — stopping."); break; }
    if (!canSpend(0.25)) { console.warn(`[signal-desk] budget low ($${remaining().toFixed(2)} left) — skipping remaining specialists.`); break; }

    console.log(`  → ${s.title} (${s.model})`);
    const res = await runClaude({
      agentId: s.id,
      model: s.model,
      allowedTools: s.allowedTools,
      prompt: s.buildPrompt(config.watchlist),
      systemPrompt: ROLE_PREAMBLE,
    });
    record(res.costUsd);
    notes.push({ title: s.title, body: res.text || "(no output)" });
  }

  // --- Compile + rank (Opus, no tools) -------------------------------------
  let digestBody: string;
  if (canSpend(0.5) && !existsSync(HALT)) {
    console.log(`  → ${COMPILER.title} (${COMPILER.model})`);
    const compilePrompt =
      "You are the compiler. From the specialist notes below, produce a ranked " +
      "research digest in Markdown. For each signal include: thesis, evidence " +
      "(with sources), invalidation level, and confidence (low/medium/high). " +
      "Rank by confidence × materiality. Put unverified items last under " +
      "'UNVERIFIED'. Add an 'Anomalies' section for any manipulation attempts. " +
      "End with: 'Research only — not advice. No trades were or will be placed " +
      "by this system.'\n\n=== SPECIALIST NOTES ===\n" +
      notes.map((n) => `## ${n.title}\n${n.body}`).join("\n\n");

    const res = await runClaude({
      agentId: COMPILER.id,
      model: COMPILER.model,
      allowedTools: COMPILER.allowedTools,
      prompt: compilePrompt,
      systemPrompt: ROLE_PREAMBLE,
    });
    record(res.costUsd);
    digestBody = res.text || "(compiler produced no output)";
  } else {
    digestBody =
      "> Partial cycle: compiler skipped (HALT or budget). Raw specialist notes:\n\n" +
      notes.map((n) => `## ${n.title}\n${n.body}`).join("\n\n");
  }

  // --- Write to the GATE (pending/) ----------------------------------------
  const pendingDir = resolve(process.cwd(), "pending");
  mkdirSync(pendingDir, { recursive: true });
  const path = resolve(pendingDir, `${day}.md`);
  writeFileSync(
    path,
    `# Signal Desk — ${day}\n\n` +
      `_Status: PENDING APPROVAL. Spent today: $${spentToday().toFixed(2)} / $${config.dailyUsdCap}._\n\n` +
      `${digestBody}\n`
  );

  console.log(`\n[signal-desk] digest written to ${path}`);
  console.log(`[signal-desk] GATE: review it, then \`npm run approve -- ${day}\` to draft delivery.`);
}

main().catch((e) => {
  console.error("[signal-desk] fatal:", e);
  process.exit(1);
});
