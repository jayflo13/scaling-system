# Getting started (PC) — signal-desk

Follow these in order. Nothing touches the real world until **Step 6**, and even
then it only writes a research file to `pending/`. No trades, no emails sent.

---

## 0. What you need first (one-time)

- **Node.js 22.6 or newer** — check with `node --version`. Get it from
  [nodejs.org](https://nodejs.org) if it's older or missing.
- **The Claude Code CLI** — install per
  [code.claude.com/docs](https://code.claude.com/docs). Verify with `claude --version`.
- **An Anthropic API key** — from [console.anthropic.com](https://console.anthropic.com).
- **(For real data) your IBKR + Gmail MCP servers** registered in Claude Code.
  You can skip this and still do a dry run — the agents just won't have market data.

---

## 1. Get the code onto your PC

If you've never cloned the repo:
```bash
git clone https://github.com/jayflo13/scaling-system.git
cd scaling-system
```

Then switch to the branch with the project:
```bash
git fetch origin
git checkout claude/ai-business-bot-agents-gm6ebn
git pull origin claude/ai-business-bot-agents-gm6ebn
```

Go into the project folder. **Run every command below from here:**
```bash
cd signal-desk
```

---

## 2. Install dependencies
```bash
npm install
```
Downloads a couple of dev dependencies. Nothing runs or connects.

---

## 3. Create your settings file
```bash
cp .env.example .env
```
Open `.env` in any editor and fill in:
```
ANTHROPIC_API_KEY=sk-ant-...        # required
DAILY_USD_CAP=5                     # hard spend ceiling per day
WATCHLIST=AAPL,MSFT,NVDA,SPY        # symbols to research
IBKR_MCP=ibkr                       # must match your MCP server name
GMAIL_MCP=gmail                     # must match your MCP server name
DIGEST_RECIPIENT=                   # your email, for the approval step
```
`.env` is gitignored — your key never gets committed.

---

## 4. Connect your MCP servers (for real market data)

The agents call tools named `mcp__ibkr__*` and `mcp__gmail__*`. Register those
servers in Claude Code so the names line up. Confirm they're connected:
```bash
claude mcp list
```
If your servers have different names, either rename them or edit the
`mcp__<name>__*` entries in `.claude/settings.json` to match.

> Skipping this? You can still run Step 6 as a dry run — the research agents
> will simply report they couldn't fetch data. Useful to confirm the plumbing
> works before wiring up your brokerage.

---

## 5. Sanity-check the safety switches (optional but recommended)
```bash
npm run halt      # creates a HALT file — freezes all agents
npm run resume    # removes it — agents may run again
```
Leave it resumed before the next step.

---

## 6. Run one research cycle
```bash
npm run desk
```
What happens:
- A few read-only agents fetch market data + news for your watchlist.
- A final agent ranks the findings.
- A markdown digest is written to `pending/<today>.md`.
- It stops. **Nothing is emailed. No trades. Ever.**

Open the file it names at the end and read your first digest.

---

## 7. (Optional) Approve delivery
Only after you've read the digest and want it emailed to yourself:
```bash
npm run approve -- 2026-06-29     # use the date in the filename
```
This archives the digest and creates a **Gmail draft** (it does *not* send).
You open Gmail and send it yourself — the final human step.

---

## 8. (Optional) Run it automatically each morning
See `crontab.example`. Start with the single weekday-morning entry. Don't add
more frequent runs until you trust the output and have confirmed the daily cap
holds.

---

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm run desk` | Run one cycle → digest in `pending/` |
| `npm run approve -- <date>` | Approve → Gmail draft (you still send) |
| `npm run audit -- <date>` | See every tool call the agents made that day |
| `npm run halt` | Emergency stop — freeze all agents |
| `npm run resume` | Clear the stop |

## If something looks off
- **"command not found: claude"** → the Claude CLI isn't installed/on PATH (Step 0).
- **Agents report no data** → MCP servers aren't connected or names don't match (Step 4).
- **Want to know exactly what it did** → `npm run audit -- <date>` reads the
  append-only log in `logs/`.
- **Want it to stop right now** → `npm run halt`.

Read `README.md` for the full design and the safety model.
