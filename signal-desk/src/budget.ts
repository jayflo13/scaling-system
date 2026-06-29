/**
 * Daily spend ceiling. State persists in state/spend-<date>.json so the cap
 * holds across multiple runs/cron fires on the same day.
 *
 * The `claude` CLI reports `total_cost_usd` per run in its JSON output; the
 * orchestrator records each run here and asks `canSpend()` before launching
 * the next (potentially expensive) agent.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "./config.ts";

const stateDir = resolve(process.cwd(), "state");

function file(day: string): string {
  return resolve(stateDir, `spend-${day}.json`);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function spentToday(): number {
  const f = file(today());
  if (!existsSync(f)) return 0;
  try {
    return Number(JSON.parse(readFileSync(f, "utf8")).usd ?? 0);
  } catch {
    return 0;
  }
}

export function record(usd: number): void {
  if (!Number.isFinite(usd) || usd <= 0) return;
  mkdirSync(stateDir, { recursive: true });
  const total = spentToday() + usd;
  writeFileSync(file(today()), JSON.stringify({ usd: total, updated: new Date().toISOString() }));
}

/** True if we can afford at least `estimate` more without breaching the cap. */
export function canSpend(estimate = 0): boolean {
  return spentToday() + estimate < config.dailyUsdCap;
}

export function remaining(): number {
  return Math.max(0, config.dailyUsdCap - spentToday());
}
