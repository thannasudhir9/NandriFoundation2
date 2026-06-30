# Nandri Connect

Nandri Connect is a progressive web application designed to bridge the gap between rural education initiatives in India (specifically the Irular communities) and their sponsors around the world. The application empowers local staff to share real-time updates and manages student records, while allowing sponsors to see the direct impact of their support.

## Core Features

- **Real-Time Feed**: A chronological feed of updates, photos, and achievements of sponsored children.
- **Role-Based Access**:
  - **Admin / Employee**: Staff in India can manage student records (CRM), post new updates, and upload photos.
  - **Sponsor**: Sponsors in Europe (and globally) can log in, view the feed, and manage their donations.
- **Multilingual Support**: Fully localized in English and German (DE).
- **Authentication**: Fully functional standalone user authentication flow with local persistence. Default Admin credentials available.
- **CRM Dashboard**: Excel export/import support for managing large volumes of student records, locations, and sponsor assignments.

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

## Support
For quick assistance, chat with us directly via WhatsApp: [+91 9000668360](https://wa.me/919000668360). This configuration can be updated dynamically in the future via the Admin Settings.

---
*Built with ❤️ for Nandri Kinderhilfe*
