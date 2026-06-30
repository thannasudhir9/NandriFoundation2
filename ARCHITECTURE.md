# System Architecture

## Overview
Nandri Connect is built as a single-page application (SPA) using a modern web stack optimized for rapid development, type safety, and global accessibility.

## Tech Stack
- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data Export/Import:** SheetJS (xlsx) for CRM data management
- **Routing/State:** React Context API for global state (Auth, Language), conditional rendering for internal tab navigation.

## Component Structure
The application is highly modular, split across distinct functional domains:
- `/src/components/Feed.tsx` - Displays real-time updates using a card-based layout.
- `/src/components/CrmDashboard.tsx` - The administrative core. Allows CRUD operations on student data, search filtering, and Excel import/export.
- `/src/components/AuthUI.tsx` & `/src/AuthContext.tsx` - Standalone authentication module managing user sessions, roles (employee vs sponsor), and routing guards.
- `/src/components/StudentsList.tsx` - Read-only (for sponsors) or managed (for employees) directory of children.
- `/src/LanguageContext.tsx` - i18n module currently supporting English (EN) and German (DE).

## Data Flow
Currently, the application operates primarily on client-side state combined with local persistence (localStorage) to allow immediate open-source deployment without complex infrastructure dependencies (e.g., GitHub Pages).

1. **User Action:** Admin imports an Excel file via `CrmDashboard`.
2. **State Update:** Component parses the file, normalizes the data, and triggers the `onAddStudent` callback.
3. **Global State:** `App.tsx` updates the `students` array.
4. **Re-render:** `Feed` and `StudentsList` automatically reflect the new entries.

## Deployment Strategy
The application is designed to be statically exported and hosted on any static file server:
- **Primary:** GitHub Pages via GitHub Actions (Workflows).
- **CI/CD:** On push to the `main` branch, a GitHub Action runs `npm run build` and deploys the resulting `dist/` directory to the `gh-pages` branch.
