# Nandri Connect

**Last Updated:** 2026-07-01 19:59 CEST

Nandri Connect is a progressive web application designed to bridge the gap between rural education initiatives in India (specifically the Irular communities) and their sponsors around the world. The application empowers local staff to share real-time updates and manages student records, while allowing sponsors to see the direct impact of their support.

Official Nandri website: [https://nandrikinderhilfe.de/](https://nandrikinderhilfe.de/)

## Core Features

- **Real-Time Feed**: A chronological feed of updates, photos, and achievements of sponsored children.
- **Role-Based Access**:
  - **Admin / Employee**: Staff in India can manage student records (CRM), post new updates, and upload photos.
  - **Sponsor**: Sponsors in Europe (and globally) can log in, view the feed, and manage their donations.
- **Multilingual Support**: Fully localized in English and German (DE).
- **Authentication**: Fully functional standalone user authentication flow with local persistence. Default Admin credentials available.
- **CRM Dashboard**: Excel export/import support for managing large volumes of student records, locations, and sponsor assignments.
- **SQLite-First Local Data**: `SyncService` now uses local SQLite via `/api/sqlite-sync` as primary source for app data in local runtime.
- **Sponsors Module**: Sponsors are persisted in DB and visible in a dedicated `Sponsors` tab placed beside `Students`.
- **Admin SQL Console (Employee/Superadmin)**:
  - View complete DB tables (`students`, `updates`, `sponsors`)
  - Create / Edit / Delete records directly in app
  - Persists all changes to SQLite through API
- **Contact Us Tab**: In-app issue reporting flow with prefilled support email to `sthanna@salesforce.com`.
- **Web-Style Navigation**: Desktop/tablet now uses top tabs like a website; mobile keeps bottom nav.
- **Responsive UI**: Unified responsive layout for web, laptop, and mobile.
- **DB Debug Logging**:
  - Browser console logs for read/write/seed/create/update/delete/sync
  - API/server logs for request payload counts and DB operations

## Setup & Installation

To run this application locally:

1. Clone the repository: `git clone https://github.com/thannasudhir9/NandriFoundation.git`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the application at `http://localhost:3000`

### Default Login
For testing purposes, the following default admin logins are pre-configured:
- **Email:** sthanna@salesforce.com (Admin)
- **Email:** thannasudhir9@gmail.com (Admin)

*(Note: In the development environment, password validation is simulated to allow testing of the open-source auth module.)*

## Architecture & Future Scope
For a detailed breakdown of the application architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).
For planned features and roadmap, see [FUTURE_SCOPE.md](./FUTURE_SCOPE.md).

## Documentation Index
- [Detailed Change Log](./docs/CHANGELOG_DETAILED.md)
- [Command Log](./docs/COMMAND_LOG.md)
- [Prompt Log](./docs/PROMPT_LOG.md)
- [Design Notes](./docs/DESIGN_NOTES.md)
- [Current Architecture](./docs/ARCHITECTURE_CURRENT.md)
- [Tools and Skills Used](./docs/TOOLS_AND_SKILLS_USED.md)
- [System Overview (Stack, DB, Login)](./docs/SYSTEM_OVERVIEW.md)
- [AI Prompt Source File](./PROMPTS.md)

## June 30 Hackathon Brief

### Goal
Pick one challenge and develop an idea/prototype/concept/sketch as a group in 45 minutes, then present results.

### Challenges
1. **Digital Experience Upgrade**  
   Current website and digital setup are basic, with most content in German only.  
   Design improved digital experience to maximize:
   - visibility and traffic
   - child sponsorships
   - donations

2. **Student Data System Modernization**  
   500 children are maintained in multiple local Excel files and one Germany-side file for personalized sponsorship tracking.  
   Design modern, compliant, decentralized student data system for:
   - student registration
   - up-to-date records
   - sponsor linkage

3. **Mobile Field Update Solution**  
   40-50 employees in India work on ground and currently use only WhatsApp on basic Android devices.  
   Design smart mobile solution so field staff can:
   - share updates with Nandri members in Europe
   - track changes for sponsored children/families
   - update website/student data with low friction

4. **Social Media Campaign (Charihackathon)**  
   Design and kick off campaign to increase awareness and sponsorships.  
   Define:
   - campaign concept
   - practical actions
   - network leverage strategy

### Presentation & Follow-Up
- Present group output at end of session.
- After presentations, contributors can help turn best concepts into reality quickly.

### Design Principles / Requirements
- Keep it simple.
- Nandri is lean with minimal administrative overhead.
- Concepts must be easy to implement and execute.
- Avoid adding operational complexity or ongoing costs.

### Optional Platform Consideration
- Salesforce Nonprofit Cloud can be considered for hackathon concepts.
- 30-day trial: [Nonprofit Cloud and Grantmaking Trial](https://www.salesforce.com/nonprofit/free-trial/nonprofit-cloud-and-grantmaking/?d=pb)

## Screenshots

### Parallel App Views
- Vite TypeScript App  
  ![Vite Home](./screenshots/vite-home.png)
- Next.js App Home  
  ![Next Home](./screenshots/next-home.png)

### Next.js Feature Pages
- Reports  
  ![Next Reports](./screenshots/next-reports.png)
- Students  
  ![Next Students](./screenshots/next-students.png)
- Sponsors  
  ![Next Sponsors](./screenshots/next-sponsors.png)
- CRM  
  ![Next CRM](./screenshots/next-crm.png)
- Admin SQL Console  
  ![Next Admin](./screenshots/next-admin.png)
- Profile  
  ![Next Profile](./screenshots/next-profile.png)
- Contact Us  
  ![Next Contact](./screenshots/next-contact.png)
- Features  
  ![Next Features](./screenshots/next-features.png)

## Feature Walkthrough (Latest)

### 1) Home + Website Tabs
- Home opens as feed-focused landing surface.
- Desktop/tablet top tabs provide website-like navigation.
- Mobile continues with bottom tab navigation.

### 2) Students + Sponsors
- Students tab shows searchable student directory and sponsorship visibility.
- Sponsors tab shows sponsor directory, donation totals, and sponsored-child counts.

### 3) CRM + Admin SQL
- CRM tab supports operational data management and sync.
- Admin SQL tab (employee/superadmin) exposes full table-level CRUD for `students`, `updates`, `sponsors`.

### 4) Reports + Insights
- Reports page provides KPI cards and visual analytics:
  - quarterly
  - half-yearly
  - annual views

### 5) Contact + Support
- Contact Us tab gives direct issue escalation path.
- One-click `mailto:` to `sthanna@salesforce.com` with issue template.

### 6) Data + Persistence
- Local runtime uses SQLite API as source of truth.
- DB file: `data/nandri.sqlite`
- App reads/writes through `/api/sqlite-sync`.

### UI Smoke + Screenshot Handler

Run one command to validate core UI routes and regenerate screenshots:

```bash
npm run ui:smoke:screenshots
```

Optional overrides:

```bash
VITE_BASE_URL=http://127.0.0.1:3000 \
NEXT_BASE_URL=http://127.0.0.1:3002 \
SCREENSHOT_DIR=screenshots \
UI_TIMEOUT_MS=5000 \
npm run ui:smoke:screenshots
```

## Support
For quick assistance, chat with us directly via WhatsApp: [+91 9000668360](https://wa.me/919000668360). This configuration can be updated dynamically in the future via the Admin Settings.

## Git Authentication Note

Never use GitHub tokens directly in clone/pull/push URLs.  
Reason: token leak risk through shell history, logs, process lists, screenshots, and shared terminals.

Use GitHub CLI authentication instead:

```bash
cd /Users/sthanna/NandriFoundation2
gh auth login
gh auth setup-git
git pull origin main
git push origin main
```

Non-interactive token flow (safer than URL embedding):

```bash
export GH_TOKEN='NEW_TOKEN'
gh auth login --with-token <<< "$GH_TOKEN"
gh auth setup-git
git pull origin main
git push origin main
```

If a token is ever pasted in chat/URL, rotate it immediately.

---
*Built with ❤️ for Nandri Kinderhilfe*
