# signal-desk

An autonomous **market-research signal desk** built on Claude Code. A scheduled
orchestrator delegates to a fleet of **read-only** specialist agents (market
data, technicals, news, risk), then compiles a daily research digest with
ranked, evidence-backed signals.

> **This system never places, modifies, or cancels trades.** It produces
> research you act on manually. Every output is queued for your approval before
> anything leaves the system (the "gate"). See [Safety model](#safety-model).

---

## What it does (one daily run)

```
cron (07:00) ─▶ orchestrator
                  ├─ market-data agent   (read-only quotes, history, themes)
                  ├─ technicals agent    (computes/contextualizes indicators)
                  ├─ news agent          (web search + summarization)
                  └─ risk agent          (sizing context, drawdown, correlations)
                          │
                          ▼
                  compiler ── ranks signals, writes digest to pending/
                          │
                          ▼
                  GATE: you review pending/<date>.md and approve.
                        Nothing is emailed/published until you do.
```

## Safety model

This is the **gated** autonomy profile. Three rules are enforced in three
independent places (settings → hooks → code) so a failure in one layer is
caught by another:

| Action | Policy | Enforced by |
| --- | --- | --- |
| Read market data, web | **Allowed** | `allowedTools` allowlist |
| Place / modify / cancel orders | **Hard denied** | settings denylist **+** `pre_tool_use` hook **+** least-privilege per-agent tools |
| Send email / publish digest | **Gated** (human approves) | digest written to `pending/`, never auto-sent |
| Anything when `HALT` file exists | **Stopped** | `pre_tool_use` hook **+** orchestrator preflight |
| Spend over daily cap | **Stopped** | `budget.ts` (reads `total_cost_usd` from each run) |

Every tool call is appended to `logs/audit-<date>.jsonl` by the `post_tool_use`
hook. If you can't explain what the system did, read that file.

## Setup

```bash
cd signal-desk
npm install
cp .env.example .env        # fill in keys; .env is gitignored
# Configure your MCP servers in Claude Code (see "MCP servers" below)
npm run desk                # one run; writes a digest to pending/
```

### MCP servers

The agents call MCP tools by **logical name**. Configure these servers in your
Claude Code MCP config so the tool names match what `.claude/settings.json` and
the per-agent allowlists expect:

| Logical name | Purpose | Used tools (read-only) |
| --- | --- | --- |
| `ibkr` | Interactive Brokers market data | `get_price_snapshot`, `get_price_history`, `get_company_themes`, `get_theme_details`, `search_contracts`, `search_investment_topics`, `get_option_data` |
| `gmail` | Digest delivery (drafts only) | `create_draft` |

> If your MCP server is registered under a different name, either rename it or
> update the `mcp__<name>__*` patterns in `.claude/settings.json` and
> `src/config.ts`. **Order tools (`create_order_instruction`,
> `delete_order_instruction`) are intentionally never granted.**

## Commands

| Command | What it does |
| --- | --- |
| `npm run desk` | Run one full cycle, write digest to `pending/` |
| `npm run approve -- <date>` | Approve a pending digest → creates a Gmail **draft** (still not auto-sent) |
| `npm run halt` | Create the `HALT` file — stops all agents immediately |
| `npm run resume` | Remove the `HALT` file |
| `npm run audit -- <date>` | Pretty-print the audit log for a day |

## Scheduling

See `crontab.example`. Start with one run per weekday morning; widen only after
you trust the output. The orchestrator is idempotent per day.

## Cost control

`src/budget.ts` enforces `DAILY_USD_CAP` (default `$5`). Each specialist runs on
a cheaper model (Haiku/Sonnet); only the compiler/ranking step uses Opus. If a
run would push the day over the cap, the orchestrator stops before spawning the
next agent and writes a partial digest.

## Disclaimer

This software produces **informational research only**. It is not investment
advice, and it does not execute trades. You are solely responsible for any
decision you make. Markets involve risk of loss.
