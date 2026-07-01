# System Overview

## Technology Stack
- Frontend framework: Next.js 15 (App Router), React 19, TypeScript.
- Parallel legacy runtime (local): Vite-compatible code path remains available.
- Styling/UI: Tailwind CSS 4, lucide-react, motion.
- Reporting/visualization: Recharts.
- Export/doc helpers: xlsx, jspdf, jspdf-autotable.
- Local automation/testing: Playwright.
- Runtime/server: Node.js (Next.js server + API routes).

## Database Stack
- Browser local DB: IndexedDB via Dexie.
- Cloud mock DB: localStorage-backed Firebase simulation.
- Local server DB: SQLite via better-sqlite3.
- Sync orchestrator: `src/db/SyncService.ts`.

## Database Details

### SQLite
- DB file: `data/nandri.sqlite`
- API route: `src/app/api/sqlite-sync/route.ts`
- Endpoints:
  - `GET /api/sqlite-sync` -> read `{ ok, students, updates }`
  - `POST /api/sqlite-sync` -> write full snapshot, return `{ ok, students, updates, syncedAt }`
- Tables:
  - `students (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`
  - `updates (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`
  - `sync_meta (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`

### IndexedDB (Dexie)
- DB name: `NandriLocalDB`
- Stores:
  - `students: 'id, name, sponsorId, village'`
  - `updates: 'id, studentId, date'`
  - `syncState: 'id'`

### Domain Data Shape
- Student:
  - `id`, `name`, `age`, `school`, `village`, `grade`, `photoUrl`, `bio`
  - optional: `sponsorName`, `sponsorEmail`, `donationAmount`
- Update:
  - `id`, `authorName`, `date`, `content`, `type`
  - optional: `studentId`, `photoUrl`
  - `type` values: `general | student`

## Sync Architecture
- 1) Pull cloud mock -> Dexie local.
- 2) Push Dexie local -> cloud mock.
- 3) Pull SQLite API -> Dexie local.
- 4) Push merged Dexie -> SQLite API.
- 5) Write `lastSync` metadata.
- Trigger points:
  - app bootstrap sync
  - save student/update local actions
  - manual CRM sync button

## Authentication and Login Details
- Auth module: local-only mock auth in `src/AuthContext.tsx`.
- Session persistence key: `localStorage['nandri_user']`.
- Auto-seeded default user on first load:
  - Email: `sthanna@salesforce.com`
  - Name: `Sudhir Thanna`
  - Role: `superadmin`
- Role mapping rules:
  - `sthanna@salesforce.com` -> `superadmin`
  - `thannasudhir9@gmail.com` -> `employee`
  - all other emails -> `sponsor`
- Password handling:
  - development simulation flow
  - no production-grade server-side password verification in current build

## Role and Access Model
- `superadmin`: full admin + settings + operational controls.
- `employee`: staff operations pages and reports.
- `sponsor`: sponsor-facing experience.
- Staff-only routes/components have role guards (reports, CRM/admin operations).

## App and Dev Commands
- `npm run dev` -> Next.js dev server.
- `npm run build` -> production build / static export.
- `npm run start` -> production server.
- `npm run lint` -> TypeScript check (`tsc --noEmit`).
- `npm run ui:smoke:screenshots` -> UI smoke validation + screenshot generation.

## UI Smoke + Screenshot Handler
- Script: `scripts/ui-smoke-and-screenshots.mjs`
- Validates core route rendering and captures full-page screenshots.
- Default targets:
  - `http://127.0.0.1:3000/` (Vite view)
  - `http://127.0.0.1:3002/`, `/reports`, `/students`, `/crm`, `/profile`, `/features` (Next.js views)
- Output path (default): `screenshots/`
- Config env vars:
  - `VITE_BASE_URL`
  - `NEXT_BASE_URL`
  - `SCREENSHOT_DIR`
  - `UI_TIMEOUT_MS`

## Deployment Stack
- CI/CD: GitHub Actions workflow at `.github/workflows/deploy-pages.yml`
- Hosting: GitHub Pages
- Next config: static export enabled in `next.config.ts`
- CI path handling: repo-aware `basePath` and `assetPrefix` applied in Actions environment

## Security and Git Authentication
- Never use GitHub tokens in git clone/pull/push URLs.
- Preferred auth flow:
  - `gh auth login`
  - `gh auth setup-git`
  - then standard `git pull origin main` / `git push origin main`
- If token exposed in URL/chat/log, rotate immediately.

## Files of Interest
- `README.md`
- `docs/ARCHITECTURE_CURRENT.md`
- `docs/TOOLS_AND_SKILLS_USED.md`
- `docs/COMMAND_LOG.md`
- `src/AuthContext.tsx`
- `src/db/SyncService.ts`
- `src/app/api/sqlite-sync/route.ts`
- `scripts/ui-smoke-and-screenshots.mjs`
