# Locora — Hyperlocal Event Discovery & Community Engagement

> **Discover nearby. Connect locally.**

Locora is a modern, responsive, accessible frontend application for discovering hyperlocal events, connecting with local communities, personalizing recommendations via SmartMatch, managing tickets, and publishing events as an organizer.

---

## 🌟 Key Features

### 1. Public Discovery
- **Hero & Location Selector:** Instant neighborhood search across multiple urban districts.
- **Multi-Faceted Event Discovery (`/discover`):** Real-time text search, category segmented filters, neighborhood filters, date ranges (today, weekend, month), pricing filters (free vs ticketed), and sorting (relevance, soonest, capacity).
- **Event Details (`/events/:eventId`):** Cover imagery with zero-broken-image fallbacks, schedule details, Google Maps integration, organizer profile preview, live capacity progress bars, and RSVP actions.
- **Public Organizer Profiles (`/organizers/:organizerId`):** Verified host profiles, contact details, community reach metrics, and active event listings.

### 2. Personalized SmartMatch (`/smart-match`)
- **Deterministic Recommendation Engine:** Transparent scoring algorithm based on user interest categories, neighborhood proximity, and admission preferences.
- **Explainable Match Cards:** Concise explanations (e.g., *"Matches your interest in Live Music & Culture"*, *"Located directly in your home neighborhood"*) so users understand why an event is suggested.

### 3. Attendee Experience
- **Attendee Dashboard (`/dashboard`):** At-a-glance hub for upcoming confirmed events, saved bookmarks, and quick actions.
- **My Registrations (`/my-registrations`):** Active and past registrations with digital entry ticket passes (complete with simulated QR codes and verification IDs) and cancellation flows.
- **Saved Events (`/saved`):** Fast bookmarking and un-bookmarking with instant optimistic updates and toast notifications.
- **Profile & Preferences (`/profile`):** Editable user name, bio, home neighborhood, and interest categories.

### 4. Organizer Console
- **Organizer Dashboard (`/organizer/dashboard`):** Overview metrics (total events, live published, total RSVPs confirmed, active districts) and recent event tables.
- **Event Creation (`/organizer/events/new`):** Validated creation form with artwork selector (preset generated editorial imagery or custom URL), start & end date/time validation (ensuring end > start), venue details, capacity limits, and pricing.
- **Event Management (`/organizer/events`):** Full list with publish/unpublish toggles, edit options, and deletion with confirmation dialogs.
- **Attendee Roster (`/organizer/events/:eventId/attendees`):** Authorized attendee management view with live search, status filtering, simulated check-in toggle, and CSV export.

---

## 🎨 Design System & Anti-Slop Discipline

- **Zero-Pill Typography:** Metadata on event cards uses clean unboxed text separated by typographic dots (`·`), eliminating candy pill capsules.
- **Top Bar Contract:** Strict 1-row, 3-zone layout: clean wordmark, single-line text navigation links, and a primary CTA.
- **60-30-10 Color Hierarchy:** 60% warm off-white canvas (`#FBFBFA`), 30% white structural cards with hairline borders (`border-slate-200/80`), and 10% high-intent indigo accent (`#4F46E5`).
- **Resilient Imagery:** Powered by custom high-fidelity Leica 35mm editorial style images generated for the platform, paired with styled SVG fallback containers.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7 (`react-router-dom`)
- **Icons:** Lucide React
- **Architecture:** Centralized typed HTTP API client (`src/services/api-client.ts`) and mock services with localStorage persistence.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The app runs at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔌 Connecting to an Independent Backend

By default, Locora operates in **Client-Side Demo Mode** with realistic data, interactive RSVPs, and local state persistence.

To connect your independently developed REST backend (e.g., built in VS Code):

1. Open `.env` (or copy from `.env.example`):
   ```bash
   VITE_API_BASE_URL="http://localhost:8000/api"
   VITE_USE_MOCK_API="false"
   ```
2. Check `API_CONTRACT.md` for the full endpoint specification, JSON schemas, and query parameters.
3. Restart the dev server. The frontend will immediately route all requests to your backend via the centralized `apiClient`.

---

## 🧪 Quick Demo Profiles

You can switch roles anytime using the top navigation bar menu or demo banner:
- **Attendee:** Sarah Chen (`sarah.chen@example.com`)
- **Organizer:** Marcus Vance (`marcus@civictech.demo`)
