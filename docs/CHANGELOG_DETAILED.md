# Detailed Change Log

**Last Updated:** 2026-07-01 19:59 CEST

## Scope
Documentation of major implementation changes completed in current build cycle.

---

## 2026-07-01 — Session 2

### Commit `8b070b4` — 2026-07-01 ~11:00
`feat: add sponsors, admin SQL, contact pages; expand sync, types, i18n, nav`

- Added `SponsorsList.tsx` — sponsors tab with search, donation totals, student counts
- Added `AdminSqlPage.tsx` — admin SQL interface for direct DB inspection
- Added `ContactUs.tsx` — contact page
- Added `app/api/sqlite-sync/route.ts` — active app-tree API route (parity with `src/app/`)
- Committed `data/nandri.sqlite` (68KB, 100 students, 9 sponsors, 2 updates)
- Added `scripts/db-init.mjs` — standalone DB bootstrap
- Expanded `src/types.ts` with Sponsor type
- Expanded `src/i18n.ts` with sponsors/contact strings
- Updated `SyncService.ts` — sponsors sync support
- Updated `BottomNav.tsx` — Sponsors + Contact nav items
- Updated `App.tsx` — new pages wired into routing
- Updated `src/data.ts` — `INITIAL_SPONSORS` derivation added
- New screenshots: next-admin.png, next-contact.png, next-sponsors.png

### Commit `6c86150` — 2026-07-01 ~10:45
`add DB and features status report with live SQLite data verification`

- Created `docs/DB_AND_FEATURES_STATUS_REPORT.md`
- Verified 4 SQLite tables live (students: 100, updates: 2, sponsors: 9, sync_meta: 1)
- Confirmed full data flow: seed → IndexedDB → mock Firebase → SQLite → UI

### Commit `d149891` — 2026-07-01 ~10:00
`add comprehensive master documentation covering all aspects of the project`

- Created `docs/MASTER_DOCUMENTATION.md` (673 lines)
- Covers: tech stack, project structure, architecture, DB schema, auth/login, features, design, env vars, CI/CD, all commands, prompt log, git history, changelog

---

## 2026-06-30 — Session 1

## Commit: `d1af390`  
`feat: migrate to Next.js and expand operations tooling`

### Platform / Build
- Migrated runtime to Next.js App Router.
- Added Next config, PostCSS config, TypeScript Next env.
- Updated scripts in `package.json` for `next dev/build/start`.

### Routing / Pages
- Added app routes:
  - `/`
  - `/students`
  - `/dashboard`
  - `/add`
  - `/crm`
  - `/profile`
  - `/features`
  - `/reports`
- Added parallel `src/app` fallback routing path with catch-all.

### Reporting
- Added report data model and aggregation utilities:
  - `lib/reporting/types.ts`
  - `lib/reporting/aggregate.ts`
- Added report UI components:
  - period selector
  - KPI cards
  - line and bar charts
  - filters
- Added reports page with quarterly / half-yearly / annual modes.

### Operations Features
- Added `LiveChatOps` command console:
  - approve/reject command workflow
  - add student
  - add user
  - queue email info
  - post content
  - queue social post
- Added voice assistant:
  - translate app language (EN/DE)
  - add child
  - add user
  - show donation information

### Donations / Social
- Added donation integrations:
  - PayPal
  - Apple Pay
  - Google Pay
  - IBAN configuration + display
- Added social posting options:
  - Facebook
  - Instagram
  - LinkedIn

### Data / Sync
- Added SQLite API route:
  - `src/app/api/sqlite-sync/route.ts`
- Extended sync flow:
  - Firebase mock ↔ local Dexie ↔ SQLite API
- Added manual sync button in CRM:
  - `Sync Firebase ↔ SQLite`

## Post-Migration Updates (Jul 1)

### Commit Scope
`feat: sqlite-first data mode + sponsors module`

### Data Layer
- Refactored `SyncService` to use SQLite API as primary source of truth.
- Removed runtime dependency on Dexie/local mock for primary app reads/writes.
- Added sponsors persistence support in SQLite payload and storage flow.

### SQLite Schema / API
- Added `sponsors` table to SQLite initialization and API read/write flow.
- Updated `/api/sqlite-sync` payload:
  - GET returns `students`, `updates`, `sponsors`
  - POST accepts and stores `students`, `updates`, `sponsors`
- Added route implementation in `app/api/sqlite-sync/route.ts` for active app tree parity.

### UI / Navigation
- Added new `Sponsors` tab beside `Students` in bottom navigation.
- Added sponsors listing screen with:
  - search by name/email/country
  - donation totals
  - sponsored children counts

### Seed / Population
- Added `INITIAL_SPONSORS` derivation from seeded student sponsorship data.
- DB seeded and verified with sponsors data (`sponsors: 9` in local test run).

### Screenshots
- Extended screenshot automation to capture new tabs/pages:
  - Sponsors
  - Admin SQL Console
  - Contact Us
- Latest screenshot artifacts added:
  - `next-sponsors.png`
  - `next-admin.png`
  - `next-contact.png`

### Config
- Updated `next.config.ts` to set `output: 'export'` only under GitHub Actions.
- Local runtime now supports API routes required for SQLite mode.

### Screenshots / Docs
- Added screenshot set in `screenshots/`.
- Updated README with screenshot gallery.

## Commit: `8b10e4c`  
`fix: stabilize reports rendering and refresh screenshots`

### Fixes
- Stabilized reports page rendering for capture/use.
- Added/updated `src/app` global style wiring.
- Re-captured all screenshot assets.

## Commit: `a78f2ff`  
`add GitHub Actions deploy workflow, next.config update, and static export output`

### Deployment
- Added GitHub Pages workflow.
- Added static export settings in Next config.
- Generated static `out/` build artifacts (build output).

## Commit: `1011838`
`update GitHub Actions deploy workflow`

### CI/CD Fix
- Updated workflow action versions.
- Added Pages auto-enable setting:
  - `enablement: true`

## Commit: `08023ec`
`update README.md`

### Security Documentation
- Added secure git auth note (avoid token-in-URL usage).
