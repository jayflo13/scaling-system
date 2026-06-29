# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this project is

**Simplifi AI** is an MVP for an AI-driven personal scheduling assistant. It
connects to a user's Google Calendar, scans upcoming events, and proactively
automates calendar management — for example, blocking packing time the evening
before a flight, or inserting travel buffers around offsite appointments. The
product framing is "set & forget" scheduling: the AI finds open slots that
respect the user's stated preferences (focus hours, family time) and books
tasks for them.

The current state is an **early MVP**: the frontend is largely driven by mock
data, and the backend implements a working Google OAuth flow plus a rule-based
automation engine. There is no LLM/AI inference wired in yet — "AI" today means
the deterministic gap-finding logic in `server/src/sync.ts`.

## Repository layout

This is a monorepo-style layout, but the two halves are **separate npm
packages with independent `package.json` and `node_modules`** — there is no
workspace tooling tying them together.

```
scaling-system/
├── README.md                 # Empty placeholder
├── CLAUDE.md                 # This file
└── simplifi-ai/              # The application
    ├── package.json          # Frontend package (React + Vite)
    ├── vite.config.ts        # Vite config; dev server on :3000, proxies /api & /auth to :3001
    ├── eslint.config.js      # Flat ESLint config (TS + React Hooks + React Refresh)
    ├── index.html            # Vite entry HTML
    ├── tsconfig*.json         # Project-referenced TS configs (app + node)
    ├── public/               # Static assets (favicon, icons)
    ├── src/                   # Frontend source
    │   ├── main.tsx           # React root (StrictMode)
    │   ├── App.tsx            # Top-level app: onboarding gate + screen switching
    │   ├── index.css          # Tailwind entry
    │   └── components/        # UI components (see below)
    └── server/               # Backend package (Express + Google APIs)
        ├── package.json       # Backend package (CommonJS)
        ├── tsconfig.json      # Backend TS config (outputs to dist/)
        ├── .env               # Local Google OAuth credentials (placeholders committed)
        └── src/
            ├── index.ts       # Express app, routes, OAuth, cron scheduler
            ├── sync.ts         # Calendar sync + rule-based automation engine
            └── db.ts           # DB access via the `team-db` CLI shell-out
```

### Frontend components (`simplifi-ai/src/components/`)

- `Sidebar.tsx` — left nav; switches between dashboard / calendar / activity screens.
- `Onboarding.tsx` — 3-step onboarding wizard (preferences, focus time, account connect). Gated by `isOnboarded` state in `App.tsx`.
- `DailyBrief.tsx` — dashboard screen; composes `StatsCard`, `ActivityFeed`, `TodaySchedule`, `QuickAdd`.
- `StatsCard.tsx` — single metric tile (color-themed).
- `ActivityFeed.tsx` / `ActivityLog.tsx` — compact feed (dashboard) and full log screen of AI actions.
- `TodaySchedule.tsx` — timeline list of schedule items, color-coded by type and status.
- `SmartCalendar.tsx` — month calendar + day schedule screen.
- `QuickAdd.tsx` — natural-language task input box (UI only; not wired to backend yet).

## Tech stack

**Frontend** (`simplifi-ai/`)
- React 19 + TypeScript, built with Vite 8.
- Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js`; configured through the plugin + `index.css`).
- `react-router-dom` is a dependency but routing is currently done with a `currentScreen` string in `App.tsx`, not the router.
- ESLint flat config (`eslint.config.js`).

**Backend** (`simplifi-ai/server/`)
- Express 5 on Node, written in TypeScript, run in dev via `nodemon` + `ts-node`.
- CommonJS module output (note: frontend is ESM, backend is CommonJS).
- `googleapis` / `google-auth-library` for Google Calendar OAuth and event access.
- `node-cron` for the background sync job.
- Persistence goes through a `team-db` CLI binary (see Data layer below).

## Common commands

Run frontend commands from `simplifi-ai/`, backend commands from `simplifi-ai/server/`.

**Frontend** (`cd simplifi-ai`)
```bash
npm install        # install deps
npm run dev        # Vite dev server on http://localhost:3000
npm run build      # tsc -b (type-check) then vite build
npm run lint       # ESLint over the repo
npm run preview    # preview a production build
```

**Backend** (`cd simplifi-ai/server`)
```bash
npm install        # install deps
npm run dev        # nodemon + ts-node, server on http://localhost:3001
npm run build      # tsc -> dist/
npm start          # node dist/index.js (run build first)
# npm test         # NOT configured — exits 1. There are no tests yet.
```

To run the full app locally, start the backend (`:3001`) and frontend (`:3000`)
in separate terminals. Vite proxies `/api` and `/auth` requests to the backend,
so the browser only talks to `:3000`.

## Backend API surface

Defined in `server/src/index.ts`:

- `GET  /auth/google` — redirects to Google's OAuth consent screen.
- `GET  /auth/google/callback` — exchanges the code, upserts the user + tokens.
- `GET  /api/user/:id/preferences` — fetch a user row.
- `POST /api/user/:id/preferences` — update `focus_hours`, `family_time`, `buffer_time`.
- `POST /api/user/:id/sync` — trigger an immediate calendar sync for a user.
- `GET  /api/user/:id/tasks` — list a user's flexible tasks.

A `node-cron` job runs every 30 minutes (`*/30 * * * *`) and syncs every user's
calendar.

## Data layer

There is **no ORM and no direct database driver**. All persistence flows through
`server/src/db.ts`, which shells out to a `team-db` CLI:

```ts
query(sql) -> exec(`team-db "<sql>"`) -> JSON.parse(stdout)
```

`team-db` is an environment-provided binary expected to be on `PATH`; it accepts
a SQL string and returns JSON. Tables referenced in the code (no migrations
exist in-repo, so this is the de-facto schema):

- `app_users` — `id`, `email`, `name`, `focus_hours`, `family_time`, `buffer_time`.
- `app_google_auth` — `user_id`, `access_token`, `refresh_token`, `expiry_date`.
- `app_flexible_tasks` — `id`, `user_id`, `title`, `duration_minutes`, `deadline`, `status`.

## The automation engine (`server/src/sync.ts`)

This is the core backend logic. `syncUserCalendar(userId)`:
1. Gets an authenticated Google client (refreshing the access token if expired).
2. Lists the user's primary-calendar events for the next 7 days.
3. Runs each event through `processEventForAutomations`, which keyword-matches
   event titles and dispatches to handlers:
   - **Flight** (`flight`/`departure`) → finds a 90-min gap the evening before (17:00–22:00) and books a packing block.
   - **Appointment** (`doctor`/`dentist`/`appointment`) → inserts 30-min travel buffers before and after.
4. Automated events are titled with a `📅 [Simplifi]` prefix and skipped on
   re-processing so the engine is idempotent. They are written both to Google
   Calendar (`events.insert`) and to `app_flexible_tasks`.

`findGap` steps in 15-minute increments and respects `checkPreferences`, which
currently hard-codes an avoided family-time window of 18:00–20:00.

## Conventions

- **Language:** TypeScript everywhere. `strict` is on in both tsconfigs. The
  frontend additionally enforces `noUnusedLocals` / `noUnusedParameters`.
- **Components:** Functional components typed as `React.FC<Props>`, default
  exports. Props interfaces are declared inline above the component. Some early
  components use `any[]` for list props (e.g. `DailyBrief`) — prefer adding real
  interfaces when you touch them.
- **Styling:** Tailwind utility classes inline in JSX. The design system uses a
  teal primary (`#0A7E8C`, dark `#075B66`, tint `#E0F2F4`) on a light gray
  background (`#F8F9FA`). Reuse these exact hex values for consistency.
- **Some feed items render HTML via `dangerouslySetInnerHTML`-style strings**
  (e.g. `title` fields containing `<strong>`/`<span>`). This content is
  currently hard-coded/mock. Do not pass unsanitized user input through these
  fields.
- **Frontend↔backend contract:** the frontend currently fetches
  `GET /api/user/mock-user-123/preferences` on load (`App.tsx`); most other UI
  data is mock. When wiring real data, follow the existing API routes above.

## Known issues & caveats (important for any backend work)

- **SQL injection:** `db.ts` builds queries via string interpolation, and
  `index.ts` / `sync.ts` interpolate user- and Google-supplied values directly
  into SQL. This is unsafe. If you add or modify queries, parameterize/escape
  inputs; do not copy the existing interpolation pattern into new code.
- **Single shared `oauth2Client`:** the OAuth client in `sync.ts` is a module
  singleton whose credentials are reset per user during sync. This is fine for
  the single-user MVP but is not safe for concurrent multi-user syncs.
- **No tests / no CI:** `npm test` is unconfigured. Verify changes manually
  (`npm run build` + `npm run lint` for the frontend; `npm run build` for the
  backend) before committing.
- **Secrets:** `server/.env` holds Google OAuth credentials with placeholder
  values. Never commit real secrets; keep `.env` values as placeholders in the
  repo.

## Git & branch workflow

- Active development branch: **`claude/claude-md-docs-kwb6wj`**. Develop and push
  here unless told otherwise; never push to `main`/`feature/*` without explicit
  permission.
- The repo's `.gitignore` lives in `simplifi-ai/` and covers `node_modules`,
  `dist`, logs, and editor files.
- Do not open a pull request unless explicitly asked.

## When extending this codebase

- New backend routes go in `server/src/index.ts`; new automation rules go in
  `processEventForAutomations` in `server/src/sync.ts`.
- New screens: add a component under `src/components/`, render it in `App.tsx`
  based on `currentScreen`, and add a nav entry in `Sidebar.tsx`. (If routing
  grows, consider migrating to the already-installed `react-router-dom`.)
- Keep the frontend and backend package boundaries separate — install deps in
  the correct package directory.
