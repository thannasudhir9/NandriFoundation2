# Design Notes

**Last Updated:** 2026-07-01 19:59 CEST

## UI Direction
- Keep interface simple, operational, and low-friction for NGO teams.
- Full-width web/laptop views; mobile framing only in mobile mode.
- Data-heavy surfaces (CRM, reports) prioritized for scanability over decorative elements.

## UX Patterns
- Command-first operations:
  - live chat command bar with approve/reject gate
  - voice command assistant for common actions
- Role-aware experience:
  - sponsor view
  - employee/superadmin operational controls

## Reporting Design
- Time-bucket analytics:
  - Quarterly
  - Half-yearly
  - Annually
- KPI-first layout:
  - totals
  - sponsorship split
  - donation totals/average
- Supporting visualizations:
  - trend line
  - village sponsorship bars
  - sponsor cohort panel

## Content / Growth Design
- Social post actions integrated where updates are authored.
- Donation options visible and configurable:
  - PayPal
  - Apple Pay
  - G Pay
  - IBAN

## Operational Design
- Sync-first CRM:
  - explicit manual sync button
  - auto sync on write
  - SQLite-first source of truth for local runtime
- Sponsors management visibility:
  - dedicated Sponsors tab beside Students
  - quick sponsor discovery by name/email/country
  - sponsor-level donation and sponsored-children rollups
- Screenshot-ready docs:
  - stable set of route screenshots for product communication.
