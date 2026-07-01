# Future Scope & Roadmap

**Last Updated:** 2026-07-01 19:59 CEST

The Nandri Connect platform is designed to scale as the foundation grows. Below are the planned features and expansions for future releases:

## Phase 1: Core Connectivity & Data Integrity (Current/Next)
- **Database Migration**: Migrate local state (React state/localStorage) to a persistent cloud database like PostgreSQL (via Cloud SQL) or Firebase Firestore.
- **Robust Auth**: Integrate OAuth providers (Google, Apple, Microsoft) for seamless sponsor login.
- **Blob Storage**: Connect AWS S3 or Google Cloud Storage to securely host and deliver high-resolution photos and video updates.

## Phase 2: Engagement & Gamification
- **Direct Messaging**: Allow secure, moderated 1-to-1 messaging between sponsors and local educational staff.
- **Donation Management**: Integrate Stripe or PayPal directly into the app to allow sponsors to increase funding, sponsor additional children, or make one-time gifts.
- **Milestone Tracking**: Automatically notify sponsors when their child hits specific educational milestones (e.g., graduating high school, college admission).

## Phase 3: Analytics & Admin Empowerment
- **Dynamic Configuration**: Move hardcoded values (like the WhatsApp support number `+919000668360`) to an Admin Settings dashboard.
- **Reporting Engine**: Advanced data visualization for the CRM dashboard, showing village-by-village literacy improvements, sponsorship retention rates, and fund distribution.
- **Offline-First Mode**: Implement a robust Service Worker caching layer (PWA) so field staff in remote Irular villages can write updates offline and sync automatically upon regaining connection.

## Open Source Contributions
We welcome contributions to make this platform more accessible to other NGOs globally. Please check the `issues` tab on GitHub for starting points!
