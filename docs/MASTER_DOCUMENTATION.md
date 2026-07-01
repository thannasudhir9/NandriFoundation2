# Nandri Foundation Connect — Master Documentation

> Live site: https://thannasudhir9.github.io/NandriFoundation2/
> Repository: https://github.com/thannasudhir9/NandriFoundation2
> Update note (Jul 1): Local runtime now uses SQLite API as primary source of truth; sponsors data + sponsors tab added.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture](#4-architecture)
5. [Database Stack & Details](#5-database-stack--details)
6. [Authentication & Login Details](#6-authentication--login-details)
7. [Features](#7-features)
8. [Design System](#8-design-system)
9. [Environment Variables](#9-environment-variables)
10. [CI/CD & Deployment](#10-cicd--deployment)
11. [All Commands Used](#11-all-commands-used)
12. [Full Prompt Log](#12-full-prompt-log)
13. [Git Commit History](#13-git-commit-history)
14. [Changelog](#14-changelog)

---

## 1. Project Overview

**Nandri Foundation Connect** is a mobile-first, offline-capable web application for managing student sponsorships, donations, and communications for the Nandri Foundation — an NGO supporting children from Irular tribal communities in Tamil Nadu, India.

| Property | Value |
|---|---|
| Project Name | Nandri Foundation Connect |
| Type | NGO Management Platform |
| Target Users | Superadmin, Employees, Sponsors |
| Deployment | GitHub Pages (static export) |
| Live URL | https://thannasudhir9.github.io/NandriFoundation2/ |

---

## 2. Tech Stack

### Frontend
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | ^15.5.19 |
| UI Library | React | ^19.0.1 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.1.14 |
| Animations | Motion (Framer) | ^12.23.24 |
| Charts | Recharts | ^3.8.1 |
| Icons | Lucide React | ^0.546.0 |

### Build & Tooling
| Tool | Version | Purpose |
|---|---|---|
| Vite (legacy) | ^5.x | Original bundler (Vite era) |
| Next.js | ^15.5.19 | Current bundler + SSG |
| TypeScript | ~5.8.2 | Type checking |
| PostCSS | latest | CSS transforms |
| ESBuild | ^0.25.0 | Fast TS compilation |
| TSX | ^4.21.0 | Run TS directly |

### Data & Storage
| Technology | Purpose |
|---|---|
| SQLite API (`/api/sqlite-sync`) | Primary local runtime source of truth (students, updates, sponsors) |
| better-sqlite3 | Server-side SQLite (Next.js API route) |
| localStorage | Auth/session auxiliary storage |

### Export & Reporting
| Library | Purpose |
|---|---|
| jsPDF + jspdf-autotable | PDF export of reports |
| xlsx | Excel export of student data |

### AI & Integrations
| Service | Library | Purpose |
|---|---|---|
| Google Gemini | @google/genai ^2.4.0 | AI features (voice, chat) |

### Mobile
| Technology | Purpose |
|---|---|
| Capacitor ^8.4.1 | iOS/Android native wrapper |
| @capacitor/ios | iOS build support |
| @capacitor/android | Android build support |

### Testing & QA
| Tool | Purpose |
|---|---|
| Playwright ^1.61.0 | Browser automation, screenshots |

### Deployment
| Service | Purpose |
|---|---|
| GitHub Actions | CI/CD pipeline |
| GitHub Pages | Static site hosting |

---

## 3. Project Structure

```
NandriFoundation2/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # GitHub Actions CI/CD
├── app/                              # Next.js App Router (current)
│   ├── layout.tsx                    # Root layout, providers
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   ├── providers.tsx                 # React context providers
│   ├── add/page.tsx                  # Add student/update page
│   ├── crm/page.tsx                  # CRM dashboard page
│   ├── dashboard/page.tsx            # Main dashboard page
│   ├── features/page.tsx             # Features showcase page
│   ├── profile/page.tsx              # User profile page
│   ├── reports/page.tsx              # Reports & analytics page
│   └── students/page.tsx             # Students list page
├── src/                              # Legacy Vite + shared source
│   ├── App.tsx                       # Vite app root
│   ├── main.tsx                      # Vite entry point
│   ├── types.ts                      # Shared TypeScript types
│   ├── data.ts                       # Seed data generator (100 students)
│   ├── i18n.ts                       # Internationalization strings
│   ├── AuthContext.tsx               # Auth state management
│   ├── ThemeContext.tsx              # Dark/light mode
│   ├── LanguageContext.tsx           # i18n language switching
│   ├── index.css                     # Base styles
│   ├── app/
│   │   ├── [[...slug]]/page.tsx      # Next.js catch-all for SPA routing
│   │   └── api/
│   │       └── sqlite-sync/
│   │           └── route.ts          # SQLite sync API endpoint
│   ├── components/
│   │   ├── Dashboard.tsx             # Student dashboard + filters
│   │   ├── CrmDashboard.tsx          # CRM with CRUD, import/export
│   │   ├── StudentsList.tsx          # Student card grid
│   │   ├── AddUpdate.tsx             # Add student/update form
│   │   ├── Profile.tsx               # User profile + settings
│   │   ├── Features.tsx              # Feature showcase
│   │   ├── Feed.tsx                  # Activity feed
│   │   ├── AuthUI.tsx                # Login/register UI
│   │   ├── BottomNav.tsx             # Mobile bottom navigation
│   │   ├── LiveChatOps.tsx           # Live chat + command interface
│   │   └── VoiceAssistant.tsx        # Voice commands + translation
│   └── db/
│       └── SyncService.ts            # IndexedDB + SQLite + mock Firebase sync
├── lib/
│   ├── data/
│   │   └── clientStore.ts            # Client data loader (loads/seeds DB)
│   └── reporting/
│       ├── aggregate.ts              # Report aggregation logic
│       └── types.ts                  # Report TypeScript types
├── components/
│   └── reports/
│       ├── DonationTrendChart.tsx    # Line chart: donation trends
│       ├── KpiCards.tsx              # KPI summary cards
│       ├── PeriodSelector.tsx        # Quarter/Half/Annual selector
│       ├── ReportFilters.tsx         # Report filter panel
│       └── SponsorshipBarChart.tsx   # Bar chart: sponsorship breakdown
├── docs/                             # All documentation
│   ├── MASTER_DOCUMENTATION.md      # This file — complete reference
│   ├── ARCHITECTURE_CURRENT.md      # Architecture detail
│   ├── CHANGELOG_DETAILED.md        # Detailed changelog
│   ├── COMMAND_LOG.md               # All commands used
│   ├── DESIGN_NOTES.md              # Design decisions
│   ├── PROMPT_LOG.md                # Session prompt history
│   ├── SYSTEM_OVERVIEW.md           # System overview
│   └── TOOLS_AND_SKILLS_USED.md     # Claude tools used
├── scripts/
│   └── ui-smoke-and-screenshots.mjs # Playwright smoke test + screenshots (includes Sponsors/Admin/Contact tabs)
├── screenshots/                      # UI screenshots
│   ├── next-home.png
│   ├── next-admin.png
│   ├── next-contact.png
│   ├── next-crm.png
│   ├── next-features.png
│   ├── next-profile.png
│   ├── next-reports.png
│   ├── next-sponsors.png
│   ├── next-students.png
│   └── vite-home.png
├── out/                              # Static export output (GitHub Pages)
├── dist/                             # Legacy Vite build output
├── public/
│   └── icon.svg                      # App icon
├── .env.example                      # Env var template
├── next.config.ts                    # Next.js config (static export, basePath)
├── tsconfig.json                     # TypeScript config
├── postcss.config.mjs                # PostCSS config
├── vite.config.ts                    # Legacy Vite config
├── capacitor.config.ts               # Capacitor mobile config
├── server.ts                         # Express dev server (legacy)
├── package.json                      # Dependencies and scripts
└── README.md                         # Project readme
```

---

## 4. Architecture

### High-Level Architecture

```
Browser (Client)
│
├── React 19 + Next.js 15 App Router
│   ├── Pages: /, /dashboard, /students, /crm, /reports, /add, /profile, /features
│   ├── Contexts: Auth, Theme, Language
│   └── Components: Dashboard, CRM, StudentsList, Reports, Chat, Voice
│
├── Client Data Layer
│   ├── Dexie (IndexedDB) — offline-first local DB
│   │   ├── students table
│   │   ├── updates table
│   │   └── syncState table
│   └── localStorage
│       ├── nandri_user        (auth state)
│       ├── mock_firebase_students
│       └── mock_firebase_updates
│
└── Sync Layer (SyncService.ts)
    ├── IndexedDB ↔ Mock Firebase (localStorage)
    └── IndexedDB ↔ SQLite API (Next.js API route)
        └── /api/sqlite-sync [GET/POST]
            └── better-sqlite3 → data/nandri.sqlite

Build & Deploy
│
├── npm run build → next build → out/ (static HTML/CSS/JS)
├── GitHub Actions → build → upload artifact → deploy to GitHub Pages
└── https://thannasudhir9.github.io/NandriFoundation2/
```

### Data Flow

```
Seed Data (src/data.ts: 100 generated students)
        ↓
clientStore.ts → seeds IndexedDB on first load
        ↓
SyncService.syncBothWays()
  ├── Pull: Mock Firebase → IndexedDB
  ├── Push: IndexedDB → Mock Firebase
  ├── Pull: SQLite API → IndexedDB  (server mode only)
  └── Push: IndexedDB → SQLite API  (server mode only)
        ↓
React components read from IndexedDB via SyncService
```

### Routing (Next.js App Router)

| Route | Page File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Landing / feed |
| `/dashboard` | `app/dashboard/page.tsx` | Student stats + filters |
| `/students` | `app/students/page.tsx` | Student card grid |
| `/crm` | `app/crm/page.tsx` | Full CRM CRUD |
| `/reports` | `app/reports/page.tsx` | Analytics + charts |
| `/add` | `app/add/page.tsx` | Add student or update |
| `/profile` | `app/profile/page.tsx` | User profile |
| `/features` | `app/features/page.tsx` | Feature showcase |

---

## 5. Database Stack & Details

### Client-Side: IndexedDB via Dexie

**Library:** `dexie ^4.4.4`
**Database Name:** `NandriLocalDB`
**DB Version:** 1

| Table | Primary Key | Indexes | Description |
|---|---|---|---|
| `students` | `id` | `name, sponsorId, village` | All student records |
| `updates` | `id` | `studentId, date` | News/activity updates |
| `syncState` | `id` | — | Last sync timestamp |

**Student record shape:**
```typescript
{
  id: string;           // "s1" .. "s100"
  name: string;
  age: number;          // 6–15
  school: string;
  village: string;
  grade: string;        // "1st Grade" .. "10th Grade"
  photoUrl: string;     // https://i.pravatar.cc/150?u=<n>
  sponsorName?: string;
  sponsorEmail?: string;
  donationAmount?: number;  // 30–80 (sponsored), 0 (unsponsored)
  bio: string;
}
```

**Update record shape:**
```typescript
{
  id: string;           // "u1", "u2", ...
  studentId?: string;   // linked student or general
  authorName: string;
  date: string;         // ISO 8601
  content: string;
  photoUrl?: string;
  type: 'general' | 'student';
}
```

### Server-Side: SQLite via better-sqlite3

**Library:** `better-sqlite3 ^12.11.1`
**File:** `data/nandri.sqlite` (auto-created, relative to project root)
**API:** Next.js route `src/app/api/sqlite-sync/route.ts`

| Table | DDL | Description |
|---|---|---|
| `students` | `id TEXT PRIMARY KEY, payload TEXT NOT NULL` | JSON blob per student |
| `updates` | `id TEXT PRIMARY KEY, payload TEXT NOT NULL` | JSON blob per update |
| `sync_meta` | `id TEXT PRIMARY KEY, payload TEXT NOT NULL` | Sync timestamps |

**API:**
- `GET /api/sqlite-sync` — returns `{ ok, students[], updates[] }` from SQLite
- `POST /api/sqlite-sync` body `{ students[], updates[] }` — transactional full replace, returns merged result

> SQLite API only active in server mode (local dev). On GitHub Pages (static), this step is gracefully skipped.

### Mock Cloud Sync (Firebase Simulation)

**Storage:** Browser `localStorage`

| Key | Value |
|---|---|
| `mock_firebase_students` | JSON array of Student objects |
| `mock_firebase_updates` | JSON array of Update objects |

Real Firebase would replace `MockCloudDB` in `src/db/SyncService.ts`.

### Seed Data Generator

Source: `src/data.ts` — generates 100 students on first load.

| Field | Pool |
|---|---|
| Names | 20 Tamil/Indian names |
| Villages | Irular Village A/B/C, Thiruvallur, Kanchipuram |
| Schools | Little Flower High School, Primary Village School, Secondary Village School |
| Grades | 1st–10th Grade |
| Sponsors | 9 named sponsors + 2 null slots (unsponsored) |
| Donation | ₹30–₹80 (sponsored), ₹0 (unsponsored) |

---

## 6. Authentication & Login Details

### Auth System

**Type:** Client-side only (no backend)
**Storage:** `localStorage` key `nandri_user`
**Implementation:** `src/AuthContext.tsx`

### Roles

| Role | Access |
|---|---|
| `superadmin` | Full — CRUD, CRM, reports, user management |
| `employee` | Operational — add updates, view students, limited CRM |
| `sponsor` | Read-only — view sponsored students |

### Role Assignment (by email)

```
sthanna@salesforce.com        →  superadmin
thannasudhir9@gmail.com       →  employee
<any other email>             →  sponsor
```

### Default Auto-Login

On first load with no stored session:

| Field | Value |
|---|---|
| Email | `sthanna@salesforce.com` |
| Name | Sudhir Thanna |
| Role | `superadmin` |
| ID | `admin1` |

### Demo Login Credentials

| Email | Role | Notes |
|---|---|---|
| `sthanna@salesforce.com` | superadmin | Default; any password accepted |
| `thannasudhir9@gmail.com` | employee | Any password accepted |
| `anyone@example.com` | sponsor | Any password accepted |

> No real password validation. This is a demo/mock auth system.

---

## 7. Features

| Feature | Route | Status |
|---|---|---|
| Student Dashboard (filter, KPIs) | `/dashboard` | Live |
| Student Card Grid | `/students` | Live |
| CRM (CRUD, import, export PDF/Excel) | `/crm` | Live |
| Reports (quarterly/half/annual charts) | `/reports` | Live |
| Add Student / Update | `/add` | Live |
| User Profile + Settings | `/profile` | Live |
| Feature Showcase | `/features` | Live |
| Dark Mode | All | Live |
| i18n / Language Switch | All | Live |
| Offline Support (IndexedDB) | All | Live |
| Two-way Sync (IndexedDB ↔ Firebase ↔ SQLite) | CRM | Live |
| Live Chat + Commands | Dashboard | Live |
| Voice Assistant (Gemini) | Dashboard | Live |
| Donation Buttons (PayPal/Apple/GPay/IBAN) | — | UI only |
| Social Share (FB/IG/LinkedIn) | — | UI only |
| Mobile (Capacitor iOS/Android) | — | Scaffolded |

---

## 8. Design System

### Colors
- Primary: Indigo-600 (`#4f46e5`)
- Background light: white / gray-50
- Background dark: gray-800 / gray-900
- Text light: gray-900
- Text dark: white
- Border light: gray-100
- Border dark: gray-700

### Card Pattern
```
bg-white dark:bg-gray-800
rounded-2xl shadow-sm
border border-gray-100 dark:border-gray-700
p-4
```

### Button Pattern
```
bg-indigo-600 hover:bg-indigo-700
text-white font-medium
rounded-xl px-4 py-2
transition-colors
```

### Layout
- Mobile-first, `max-w-6xl mx-auto px-4`
- Full-page desktop (no mobile frame wrapper)
- Fixed bottom nav (5 tabs) for mobile
- `transition-colors duration-300` on all theme-sensitive containers

### Charts (Recharts)
- Purple/indigo palette
- Responsive containers
- Custom tooltips
- Period selector: Quarterly / Half-Yearly / Annual

---

## 9. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | For AI features | Google AI Studio API key |
| `APP_URL` | Optional | Deployed app URL |
| `GITHUB_ACTIONS` | Auto (CI) | Triggers Pages basePath |

**next.config.ts logic:**
```typescript
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
// GitHub Actions: basePath=/NandriFoundation2, assetPrefix=/NandriFoundation2/
// Local: no basePath
```

---

## 10. CI/CD & Deployment

### GitHub Actions Workflow

**File:** `.github/workflows/deploy-pages.yml`
**Triggers:** Push to `main`, manual workflow dispatch

```
push to main
    ↓
[build]
  1. actions/checkout@v5
  2. actions/setup-node@v5 (Node 20, npm cache)
  3. actions/configure-pages@v5 (enablement: true)
  4. npm ci
  5. npm run build  →  out/
  6. touch out/.nojekyll
  7. actions/upload-pages-artifact@v4 (path: out)
    ↓
[deploy]
  8. actions/deploy-pages@v4
    ↓
https://thannasudhir9.github.io/NandriFoundation2/
```

### Permissions Required
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### GitHub Pages Settings
- Settings → Pages → Source → **GitHub Actions**

---

## 11. All Commands Used

### Setup
```bash
npm install
npm ci
```

### Development
```bash
npm run dev
npm run dev -- --hostname 127.0.0.1 --port 3002
WATCHPACK_POLLING=true npm run dev -- --hostname 127.0.0.1 --port 3002
npm run start -- --hostname 127.0.0.1 --port 3004
```

### Build & Lint
```bash
npm run build
npm run lint          # tsc --noEmit
npm run clean         # rm -rf .next dist
```

### Playwright Screenshots
```bash
npm install -D playwright
npx playwright install chromium

npx playwright screenshot \
  --device="Desktop Chrome" \
  --timeout=5000 \
  "http://127.0.0.1:3002/" \
  "screenshots/next-home.png"

npm run ui:smoke:screenshots

NEXT_BASE_URL=http://127.0.0.1:3002 \
SCREENSHOT_DIR=screenshots \
UI_TIMEOUT_MS=5000 \
npm run ui:smoke:screenshots
```

### Git
```bash
git status
git status --short --branch
git diff --stat
git log --oneline
git log --oneline --decorate -12
git add <files>
git commit -m "message"

git pull https://thannasudhir9:<TOKEN>@github.com/thannasudhir9/NandriFoundation2.git main
git push https://thannasudhir9:<TOKEN>@github.com/thannasudhir9/NandriFoundation2.git main
```

### Live Site Verification
```bash
curl -I https://thannasudhir9.github.io/NandriFoundation2/
curl -s https://thannasudhir9.github.io/NandriFoundation2/ | grep -i "nandri"
```

---

## 12. Full Prompt Log

| # | Prompt |
|---|---|
| 1 | Pull repository into current project folder |
| 2 | Implement dashboard to view and filter students, sponsorships, donation amounts |
| 3 | Add June 30 hackathon brief into README as requirements |
| 4 | Start app, navigate, capture screenshots |
| 5 | Migrate to Next.js and add quarterly/half-yearly/annual reports |
| 6 | Implement chat button + live chat with approve/reject and commands (add student, add user, email info, post content) |
| 7 | Add donation integrations: PayPal, Apple Pay, G Pay, IBAN |
| 8 | Add social posting: Facebook, Instagram, LinkedIn |
| 9 | Add voice feature: translate, add child info, add user, show donation information |
| 10 | Ensure web and laptop views use full page (non-mobile framing) |
| 11 | Add local SQLite + two-way sync button (Firebase ↔ SQLite) |
| 12 | Re-take screenshots, improve quality, update README, push |
| 13 | Add GitHub Pages deploy workflow; verify site live |
| 14 | Pull and push code to repo |
| 15 | Push all code changes to repo |
| 16 | Push code to repo |
| 17 | Push all code changes to repo |
| 18 | Check if website is live |
| 19 | Do documentation with each and every changes, commands, prompt logs, design, architecture, tech stack, project structure, db stack, db details, login details and everything |

---

## 13. Git Commit History

| Hash | Message |
|---|---|
| `8ddaf4b` | add docs, scripts, update README, package.json, and screenshots |
| `1011838` | update GitHub Actions deploy workflow |
| `a78f2ff` | add GitHub Actions deploy workflow, next.config update, and static export output |
| `8b10e4c` | fix: stabilize reports rendering and refresh screenshots |
| `08023ec` | update README.md |
| `d1af390` | feat: migrate to Next.js and expand operations tooling |
| `a9be895` | feat: implement dark mode, offline sync, and i18n |
| `d6ea15c` | feat: scaffold Nandri Connect application |
| `517d813` | Initial commit |

---

## 14. Changelog

### v0.8 — Documentation & Deploy
- Added `docs/MASTER_DOCUMENTATION.md` (this file)
- Added Playwright smoke test + screenshot automation (`scripts/ui-smoke-and-screenshots.mjs`)
- GitHub Pages live and confirmed
- Screenshots refreshed; README updated with live site link

### v0.7 — GitHub Pages CI/CD
- `.github/workflows/deploy-pages.yml` — full build + deploy pipeline
- `next.config.ts` updated: `output: 'export'`, conditional `basePath`/`assetPrefix`
- `out/.nojekyll` added to bypass Jekyll processing
- GitHub Pages source set to GitHub Actions

### v0.6 — Reports Stability Fix
- Reports page hydration issues resolved
- Chart rendering stabilized for static export
- Screenshots refreshed

### v0.5 — Next.js Migration + Full Operations Tooling
- Migrated from Vite to Next.js 15 App Router
- Reports page: quarterly/half-yearly/annual with Recharts
- KPI cards, donation trend chart, sponsorship bar chart
- CRM: full CRUD, Excel/PDF import-export
- SQLite API route: `GET/POST /api/sqlite-sync`
- Two-way sync: IndexedDB ↔ Mock Firebase ↔ SQLite
- Donation UI: PayPal, Apple Pay, G Pay, IBAN
- Social share UI: Facebook, Instagram, LinkedIn

### v0.4 — Dark Mode, Offline Sync, i18n
- Dark mode via ThemeContext (localStorage-persisted)
- Offline-first: Dexie IndexedDB as primary store
- i18n: LanguageContext + `src/i18n.ts`
- Mock Firebase two-way sync simulation

### v0.3 — Nandri Connect App Scaffold
- Vite + React + TypeScript + Tailwind base
- Dashboard with student filter + KPIs
- CRM dashboard with full CRUD
- Students list, add/update, profile, features pages
- Role-based auth (superadmin/employee/sponsor)
- Mobile bottom navigation
- Voice assistant (Web Speech API + Gemini)
- Live chat with commands
- 100-student seed data generator

### v0.1 — Initial Commit
- Repository initialized
