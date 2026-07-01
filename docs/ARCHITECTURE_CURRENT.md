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
  - feed, students, CRM, dashboard, profile, features
  - reports component set
  - live chat ops
  - voice assistant

### Domain Layer
- Core entities:
  - `Student`
  - `Update`
- Reporting DTOs and aggregation in `lib/reporting/*`.

### Data Layer
- Local browser DB: Dexie (`src/db/SyncService.ts`).
- Cloud mock: localStorage-backed Firebase simulation.
- Local server DB: SQLite (`src/app/api/sqlite-sync/route.ts`).

## Sync Architecture

### Flow
1. Pull cloud mock → local Dexie.
2. Persist local Dexie → cloud mock.
3. Pull SQLite API → local Dexie (merge path).
4. Push merged local Dexie → SQLite API.
5. Persist `lastSync` metadata.

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
