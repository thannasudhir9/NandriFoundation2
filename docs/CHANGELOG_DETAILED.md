# Detailed Change Log

## Scope
Documentation of major implementation changes completed in current build cycle.

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
