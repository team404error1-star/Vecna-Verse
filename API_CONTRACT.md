# Locora Frontend & Backend REST API Integration Contract

This document provides the complete API specification and contract for the backend service being developed in VS Code.

The Locora frontend is built with strict separation in mind. By default, it operates in client-side demo mode using typed mock services and `localStorage`. When the backend is ready, setting `VITE_USE_MOCK_API="false"` and configuring `VITE_API_BASE_URL` in `.env` connects the frontend directly to your backend.

---

## 1. Global Conventions

- **Base URL:** Defined via `VITE_API_BASE_URL` (default: `/api`)
- **Content Type:** `application/json`
- **Authentication:** Bearer token passed in HTTP `Authorization` header:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Standard Error Response Format:**
  ```json
  {
    "success": false,
    "message": "Human-readable explanation of error",
    "details": {}
  }
  ```

---

## 2. API Endpoints Specification

### A. Health & Status
#### `GET /api/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2026-10-24T07:15:00Z"
  }
  ```

---

### B. Events Management

#### `GET /api/events`
Query parameters:
- `query` (optional string): Full-text search across title, summary, description, and tags.
- `category` (optional string): e.g., `'Technology & Hackathons'`, `'Food & Community'`.
- `neighborhood` (optional string): e.g., `'Downtown Arts District'`, `'Silverlake Commons'`.
- `dateRange` (optional enum: `'all' | 'today' | 'this_weekend' | 'this_month'`).
- `priceType` (optional enum: `'all' | 'free' | 'paid'`).
- `sortBy` (optional enum: `'soonest' | 'relevance' | 'capacity'`).
- `page` (optional integer, default `1`).
- `pageSize` (optional integer, default `12`).

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "evt-1",
      "title": "Metro Civic Hackathon: Urban Transit & Mobility Solutions",
      "slug": "metro-civic-hackathon-urban-transit",
      "summary": "A 24-hour community hackathon designing open-source tools for transit.",
      "description": "Full markdown or rich text description of the event.",
      "category": "Technology & Hackathons",
      "coverImage": "https://example.com/images/hackathon.jpg",
      "startDate": "2026-11-14T09:00:00Z",
      "endDate": "2026-11-15T17:00:00Z",
      "venueName": "Urban Innovation Lab — Floor 4",
      "address": "420 Technology Way",
      "neighborhood": "Downtown Arts District",
      "city": "Metro City",
      "price": 0,
      "capacity": 80,
      "registeredCount": 64,
      "status": "published",
      "tags": ["Coding", "Civic Tech", "Open Data"],
      "isFeatured": true,
      "ageRestriction": "All Ages",
      "organizer": {
        "id": "org-1",
        "name": "Metro Civic Tech Collective",
        "slug": "metro-civic-tech",
        "avatar": "https://example.com/avatar.jpg",
        "bio": "Civic innovators and tech advocates.",
        "location": "Downtown Arts District"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 12,
  "totalPages": 1
}
```

#### `GET /api/events/:eventId`
- **Response (200 OK):** Single `EventItem` object matching above schema.
- **Response (404 Not Found):** `{ "message": "Event not found" }`

#### `POST /api/events` (Organizer Authorized)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Acoustic Garden Session",
    "summary": "Intimate indie music evening.",
    "description": "Detailed description...",
    "category": "Live Music & Culture",
    "coverImage": "https://example.com/img.jpg",
    "startDate": "2026-11-20T19:00:00Z",
    "endDate": "2026-11-20T21:30:00Z",
    "venueName": "Community Garden Courtyard",
    "address": "120 Rose Street",
    "neighborhood": "Silverlake Commons",
    "city": "Metro City",
    "price": 10,
    "capacity": 50,
    "tags": ["Music", "Acoustic", "Community"]
  }
  ```
- **Response (201 Created):** Created `EventItem`.

#### `PATCH /api/events/:eventId` (Organizer Authorized)
- Partial updates of `EventItem` fields.

#### `DELETE /api/events/:eventId` (Organizer Authorized)
- **Response (204 No Content)**

---

### C. Registrations & RSVPs

#### `GET /api/me/registrations` (Authenticated Attendee)
- **Response (200 OK):**
  ```json
  [
    {
      "id": "reg-101",
      "eventId": "evt-1",
      "event": { /* EventItem */ },
      "userId": "usr-attendee-1",
      "userName": "Sarah Chen",
      "userEmail": "sarah.chen@example.com",
      "status": "confirmed",
      "registeredAt": "2026-10-24T08:00:00Z",
      "ticketCode": "LOC-4921-TK",
      "checkedIn": false
    }
  ]
  ```

#### `POST /api/events/:eventId/registrations` (Authenticated Attendee)
- Registers the current user for the event. Validates that `registeredCount < capacity`.
- Generates a unique `ticketCode`.
- **Response (201 Created):** `AttendeeRegistration` object.

#### `DELETE /api/registrations/:registrationId` (Authenticated Attendee)
- Cancels an RSVP and decrements the event's `registeredCount`.
- **Response (204 No Content)**

#### `GET /api/events/:eventId/attendees` (Organizer Authorized)
- Returns array of `AttendeeRegistration` objects for the specified event.

---

### D. Saved / Bookmarked Events

#### `GET /api/me/saved-events`
- **Response (200 OK):** Array of saved `EventItem` objects.

#### `POST /api/me/saved-events/:eventId`
- Adds event to user's saved list.

#### `DELETE /api/me/saved-events/:eventId`
- Removes event from user's saved list.

---

### E. SmartMatch Recommendations

#### `GET /api/smart-match/recommendations`
Query parameters:
- `interests`: Comma-separated list of categories.
- `neighborhood`: Preferred neighborhood string.
- `freeOnly`: Boolean string `'true' | 'false'`.

**Response (200 OK):**
```json
[
  {
    "event": { /* EventItem */ },
    "score": 92,
    "matchReasons": [
      "Matches your interest in Food & Community",
      "Located directly in your home neighborhood (Silverlake Commons)",
      "Free community admission"
    ]
  }
]
```

---

### F. Authentication & User Profiles

#### `POST /api/auth/login`
- **Body:** `{ "email": "user@example.com", "password": "password123" }`
- **Response (200 OK):** `{ "token": "jwt_string", "user": { /* UserProfile */ } }`

#### `POST /api/auth/signup`
- **Body:** `{ "name": "Name", "email": "user@example.com", "role": "attendee" | "organizer" }`
- **Response (201 Created):** `{ "token": "jwt_string", "user": { /* UserProfile */ } }`

#### `GET /api/me`
- **Response (200 OK):** Current `UserProfile` object.

#### `PATCH /api/me`
- **Body:** `{ "name": "...", "bio": "...", "neighborhood": "...", "interests": [...] }`
- **Response (200 OK):** Updated `UserProfile` object.

---

## 3. Switching Between Demo and Real Backend

1. In `.env`:
   ```bash
   VITE_API_BASE_URL="http://localhost:8000/api"
   VITE_USE_MOCK_API="false"
   ```
2. Restart the frontend dev server. The frontend will now make real network requests using `fetch` with the `Authorization: Bearer <token>` header.
