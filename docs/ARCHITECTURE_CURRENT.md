# Current Architecture (Post-Migration)

## Runtime Topology
- Next.js App Router (static export target).
- Legacy Vite entry still available for parallel compatibility in local development.

## App Layers

### Presentation Layer
- App shell and route pages:
  - `app/*`
  - `src/app/*` fallback tree
- Feature components:
  - feed, students, sponsors, CRM, dashboard, profile, features
  - reports component set
  - live chat ops
  - voice assistant

### Domain Layer
- Core entities:
  - `Student`
  - `Update`
  - `Sponsor`
- Reporting DTOs and aggregation in `lib/reporting/*`.

### Data Layer
- Local server DB (primary): SQLite (`src/app/api/sqlite-sync/route.ts` and `app/api/sqlite-sync/route.ts`).
- Sync service persists app state via `/api/sqlite-sync`.
- SQLite tables: `students`, `updates`, `sponsors`, `sync_meta`.

## Sync Architecture

### Flow
1. Seed SQLite from current app data if empty.
2. Read students/updates/sponsors from SQLite API.
3. Persist writes (add/update/delete) back to SQLite API.
4. Persist `lastSync` metadata.

### Trigger Points
- App bootstrap sync.
- Student/update local saves (auto trigger).
- CRM manual sync button.

## Reporting Architecture
- Filters + period selection at page level.
- Aggregator computes:
  - KPI summary
  - donation trend buckets
  - sponsorship by village
  - sponsor cohorts
- Rendered through chart + table components.

## Deployment Architecture
- GitHub Actions workflow builds static export.
- Artifacts deployed to GitHub Pages.
- `next.config.ts` applies repo-aware basePath/assetPrefix in Actions.
