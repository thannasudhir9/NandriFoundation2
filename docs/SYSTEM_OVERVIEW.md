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
- Local server DB: SQLite via better-sqlite3.
- Sync orchestrator: `src/db/SyncService.ts`.
- Runtime source of truth: SQLite API (`/api/sqlite-sync`) in local/dev runtime.

## Database Details

### SQLite
- DB file: `data/nandri.sqlite`
- API route: `src/app/api/sqlite-sync/route.ts`
- Endpoints:
  - `GET /api/sqlite-sync` -> read `{ ok, students, updates, sponsors }`
  - `POST /api/sqlite-sync` -> write full snapshot, return `{ ok, students, updates, sponsors, syncedAt }`
- Tables:
  - `students (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`
  - `updates (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`
  - `sponsors (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`
  - `sync_meta (id TEXT PRIMARY KEY, payload TEXT NOT NULL)`

### Domain Data Shape
- Student:
  - `id`, `name`, `age`, `school`, `village`, `grade`, `photoUrl`, `bio`
  - optional: `sponsorName`, `sponsorEmail`, `donationAmount`
- Update:
  - `id`, `authorName`, `date`, `content`, `type`
  - optional: `studentId`, `photoUrl`
  - `type` values: `general | student`
- Sponsor:
  - `id`, `name`, `email`, `donationTotal`, `sponsoredStudentCount`
  - optional: `phone`, `country`

## Sync Architecture
- 1) Seed SQLite once from current app data if empty.
- 2) Read students/updates/sponsors from SQLite API.
- 3) Persist all writes (student/update/delete) back to SQLite API.
- 4) Write `lastSync` metadata in SQLite.
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
- `npm run db:init` -> create local `data/nandri.sqlite` and base tables.
- `npm run ui:smoke:screenshots` -> UI smoke validation + screenshot generation.

## Latest Functional Additions
- Sponsors dataset persisted in SQLite `sponsors` table.
- New `Sponsors` tab placed beside `Students` in bottom navigation.
- `next.config.ts` uses `output: 'export'` only in GitHub Actions, so local runtime can serve API routes.

## UI Smoke + Screenshot Handler
- Script: `scripts/ui-smoke-and-screenshots.mjs`
- Validates core route rendering and captures full-page screenshots.
- Default targets:
  - `http://127.0.0.1:3000/` (Vite view)
  - `http://127.0.0.1:3002/`, `/reports`, `/students`, `/crm`, `/profile`, `/features` (Next.js views)
- Additional tab captures:
  - Sponsors tab
  - Admin tab
  - Contact Us tab
- Output path (default): `screenshots/`
- Config env vars:
  - `VITE_BASE_URL`
  - `NEXT_BASE_URL`
  - `SCREENSHOT_DIR`
  - `UI_TIMEOUT_MS`

Latest screenshot artifacts:
- `screenshots/vite-home.png`
- `screenshots/next-home.png`
- `screenshots/next-reports.png`
- `screenshots/next-students.png`
- `screenshots/next-sponsors.png`
- `screenshots/next-crm.png`
- `screenshots/next-admin.png`
- `screenshots/next-profile.png`
- `screenshots/next-contact.png`
- `screenshots/next-features.png`

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
