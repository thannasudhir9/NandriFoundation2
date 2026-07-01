# PRD: Hackathon Video Feature Pack (V1)

## Source
- Video: `Nandri VTO Hackathon Presentation June 30.mp4`
- Date created: `2026-07-01 19:21 CEST`

## Problem
Student/sponsor operations spread across manual files. Limited structured sponsor-child mapping. Need auditable data model and direct sponsorship operations UI.

## Goals
- Add normalized sponsorship entities.
- Persist new entities in SQLite sync flow.
- Expose sponsorship links in app UI for staff.
- Keep compatibility with current students/sponsors/updates workflows.

## Non-Goals (V1)
- No payment gateway execution.
- No outbound email automation.
- No offline mobile queue in this iteration.

## Functional Requirements
1. Add `Program` and `Sponsorship` models.
2. Seed initial programs + sponsorship links from existing student/sponsor data.
3. Extend SQLite API and SyncService read/write payload for new models.
4. Add `Sponsorships` page/tab:
   - List sponsorship rows (sponsor, student, program, amount, status, start date).
   - Search by sponsor/student/program.
   - Basic KPI chips: total links, active links, total monthly commitment.
5. Restrict page to staff roles (`employee`, `superadmin`).

## Success Metrics
- New tables available in API payload without breaking existing calls.
- App loads sponsorship data from SQLite.
- Staff can view sponsorship link matrix and KPIs.
- `npm run lint` passes.

## Risks
- Existing SQLite DB missing new table rows after migration.
- Legacy records lacking sponsor linkage.

## Mitigation
- Backfill logic from existing `students` + `sponsors`.
- Graceful fallback to empty arrays.
