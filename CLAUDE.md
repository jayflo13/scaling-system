# CLAUDE.md

Guidance for AI assistants (Claude Code and others) working in this repository.

## What this is

**Simplifi AI** — an AI scheduling assistant that connects to a user's Google
Calendar and automatically books/reschedules "flexible" tasks (deep-work
blocks, gym, errands) around fixed commitments, plus proactive automations
(e.g. blocking packing time before a flight, adding travel buffers around
offsite appointments).

The repository is a small MVP. All application code lives under
`simplifi-ai/`, split into a React frontend (the Vite project root) and an
Express backend (`simplifi-ai/server/`).

```
scaling-system/
├── README.md              # currently empty
└── simplifi-ai/
    ├── src/               # React frontend (Vite root)
    │   ├── App.tsx        # top-level screen routing + mock data
    │   ├── main.tsx       # React entrypoint
    │   ├── index.css      # Tailwind import + globals
    │   └── components/     # UI components (one default export each)
    ├── server/            # Express + Google Calendar backend
    │   └── src/
    │       ├── index.ts   # Express app, routes, OAuth, cron
    │       ├── sync.ts    # calendar sync + automation engine
    │       └── db.ts      # database access layer
    ├── public/            # static assets
    ├── index.html         # Vite HTML entry
    ├── vite.config.ts
    └── package.json       # frontend scripts/deps
```

## Tech stack

**Frontend** (`simplifi-ai/`)
- React 19 + TypeScript, bundled with Vite 8
- Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no `tailwind.config.js`;
  configuration is CSS-first in `src/index.css`)
- `react-router-dom` v7 is installed but **not currently wired up** — screen
  switching is done with local state in `App.tsx`, not routes
- ESM (`"type": "module"`)

**Backend** (`simplifi-ai/server/`)
- Express 5 on Node, written in TypeScript, run via `ts-node`/`nodemon`
- `googleapis` + `google-auth-library` for Google OAuth2 and Calendar API
- `node-cron` for the background sync job
- CommonJS (`"type": "commonjs"`) — note this differs from the ESM frontend

## Running the project

Frontend and backend are **separate npm packages** with their own
`package.json` and `node_modules`. Install and run each independently.

**Frontend** (from `simplifi-ai/`):
```bash
npm install
npm run dev      # Vite dev server on http://localhost:3000
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview
```

**Backend** (from `simplifi-ai/server/`):
```bash
npm install
npm run dev      # nodemon src/index.ts on http://localhost:3001
npm run build    # tsc -> dist/
npm start        # node dist/index.js
```

The Vite dev server proxies `/api` and `/auth` to `http://localhost:3001`
(see `vite.config.ts`), so run both servers together during development.
Ports: **frontend 3000**, **backend 3001**.

### Environment variables (backend)

`server/.env` is read via `dotenv`. Required keys:
- `PORT` (defaults to 3001)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` (defaults to `http://localhost:3001/auth/google/callback`)

Do not commit real secret values. `.env` currently exists in the repo with
placeholder/local values — treat its contents as sensitive and never echo
real credentials into chat, commits, or logs.

## Backend architecture

### Data layer (`server/src/db.ts`)
All persistence goes through a single `query(sql: string)` helper. It does
**not** use a Node database driver — it shells out to an external `team-db`
CLI via `child_process.exec` and parses the CLI's JSON stdout. Keep all DB
access funneled through this `query` function.

Tables referenced in the code (no migrations are checked in):
- `app_users` — `id`, `email`, `name`, `focus_hours`, `family_time`,
  `buffer_time`
- `app_google_auth` — `user_id`, `access_token`, `refresh_token`,
  `expiry_date`
- `app_flexible_tasks` — `id`, `user_id`, `title`, `duration_minutes`,
  `deadline`, `status`

### HTTP routes (`server/src/index.ts`)
- `GET  /auth/google` — redirect to Google OAuth consent
- `GET  /auth/google/callback` — exchange code, upsert user + tokens
- `GET  /api/user/:id/preferences` — fetch a user row
- `POST /api/user/:id/preferences` — update focus/family/buffer prefs
- `POST /api/user/:id/sync` — trigger an immediate calendar sync
- `GET  /api/user/:id/tasks` — list a user's flexible tasks

### Sync & automation engine (`server/src/sync.ts`)
- `getAuthenticatedClient(userId)` loads stored tokens, refreshes them when
  expired, and persists the new access token.
- `syncUserCalendar(userId)` pulls the next 7 days of primary-calendar events
  and runs each through `processEventForAutomations`.
- Automations are triggered by keyword matching on the event summary:
  - "flight"/"departure" → `handleFlightAutomation` (find a 90-min gap the
    evening before and book packing time)
  - "doctor"/"dentist"/"appointment" → `handleOffsiteAutomation` (add 30-min
    travel buffers before and after)
- `findGap` / `checkPreferences` implement simple slot-finding that steps in
  15-minute increments and avoids a hardcoded family-time window
  (18:00–20:00).
- Events created by the system are titled with a `📅 [Simplifi]` prefix and
  are skipped on re-sync so automations are idempotent.

### Background job
`index.ts` schedules a `node-cron` job (`*/30 * * * *`) that runs
`syncUserCalendar` for every user every 30 minutes.

## Frontend architecture

- `App.tsx` is the shell. It holds `currentScreen` state and renders one of
  three screens (`dashboard` → `DailyBrief`, `calendar` → `SmartCalendar`,
  `activity` → `ActivityLog`) inside `MainLayout` (sidebar + main pane). Until
  onboarding completes it renders `Onboarding` full-screen.
- Most dashboard data (stats, activity feed, schedule) is **hardcoded mock
  data** in `App.tsx`. The only live call is a `fetch` to
  `/api/user/mock-user-123/preferences` in a `useEffect`; the user id is a
  placeholder. When wiring real data, replace the mock arrays and the
  hardcoded `userId`.
- Components live in `src/components/`, each a single default-exported
  `React.FC` with a co-located props `interface`/inline type. Examples:
  `Sidebar`, `DailyBrief`, `SmartCalendar`, `ActivityLog`, `ActivityFeed`,
  `TodaySchedule`, `StatsCard`, `QuickAdd`, `Onboarding`.
- Some components render server-provided strings with `dangerouslySetInnerHTML`
  (activity titles contain inline `<strong>`/`<span>` markup). Be careful not
  to feed unsanitized user input through these paths.

## Conventions

- **Styling:** Tailwind utility classes inline in JSX. The design uses a fixed
  palette — primary teal `#0A7E8C` (dark `#075B66`, tint `#E0F2F4`), violet
  accent `#7C6FBA`, page background `#F8F9FA`, text `#212529`. Reuse these
  exact hex values (frequently via arbitrary-value classes like
  `bg-[#0A7E8C]`) rather than introducing new colors.
- **Components:** one component per file, `PascalCase` filename matching the
  component, default export, typed props.
- **TypeScript:** strict mode on both sides. Frontend uses bundler module
  resolution with `.tsx` imports allowed; backend uses CommonJS/`esModuleInterop`.
- **Linting:** frontend has ESLint (`npm run lint`) with the
  typescript-eslint, react-hooks, and react-refresh configs. The backend has
  no linter and its `test` script is a placeholder — there are **no tests** in
  the repo yet.
- Match the existing file's style (indentation, naming, inline-Tailwind
  density) when editing.

## Known issues / caution

These are existing patterns in the MVP. Do **not** propagate them into new
code, and prefer fixing them when you touch the surrounding area:

- **SQL injection:** `db.ts` queries are built with raw string interpolation
  of user/OAuth data (e.g. `WHERE id = '${id}'`). New queries should
  parameterize/escape input; at minimum follow the `replace(/'/g, "''")`
  escaping already used in `createAutomatedEvent` and avoid widening the
  exposure.
- OAuth tokens are stored in plaintext in the database.
- A single module-level `oauth2Client` is shared across requests in both
  `index.ts` and `sync.ts`, which is not safe for concurrent multi-user use.
- `react-router-dom` is a dependency but unused; navigation is state-based.

## Git workflow

- Active development branch for this work: `claude/claude-md-docs-p1n3qj`.
- Other branches in the repo: `feature/mvp-foundation`.
- Commit with clear messages and push with `git push -u origin <branch>`.
- Do **not** open a pull request unless explicitly asked.
</content>
</invoke>
