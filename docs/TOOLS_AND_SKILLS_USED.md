# Tools and Skills Used

## Core Stack
- Next.js (App Router, static export)
- React + TypeScript
- Tailwind CSS
- Dexie (browser local DB)
- better-sqlite3 (server-side local SQLite)
- Recharts (reporting charts)
- Playwright (UI smoke + screenshots)

## Automation / Delivery
- GitHub Actions (Pages deployment workflow)
- GitHub Pages (static hosting)
- npm scripts for local automation

## Agent/Execution Tools Used During Delivery
- Shell tool:
  - dependency install
  - build/lint verification
  - git operations
  - route checks
  - screenshot automation execution
- ReadFile / rg / Glob:
  - code discovery
  - targeted edits validation
- ApplyPatch:
  - deterministic code/doc updates
- WebFetch:
  - production URL live checks
- ReadLints:
  - post-change lint validation

## Skills Applied
- Architecture migration (Vite -> Next.js).
- Reporting design + KPI modeling.
- Ops tooling design (chat commands + voice assistant).
- Sync architecture (Firebase mock ↔ Dexie ↔ SQLite).
- CI/CD hardening for GitHub Pages.
- Documentation packaging for delivery traceability.
