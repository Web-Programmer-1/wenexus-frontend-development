# WeNexus Event Booking System - Frontend

This is the frontend for the Event Booking System built using React (TypeScript) and Vite.

## Core Features
1. **Real-time Status Updates**:
   - Polling logic automatically refreshes booking statuses (`PENDING`, `CONFIRMED`, `FAILED`) and event seat capacities every 3 seconds.
2. **Dashboard Controls**:
   - Filtering of bookings by Event and Status.
   - Client-side pagination.
   - Interactive loading states, loading spinners, and styled badges.
3. **Clean Premium Design System**:
   - Modern Glassmorphism/Dark mode styling using HSL custom properties.
   - Built using Vanilla CSS custom layout helpers and CSS custom properties without unnecessary visual bloat.

---

## Technical Stack

- **Framework**: React (v19) + Vite
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with CSS Variables

---

## Folder Structure

```
frontend/src/
├── assets/             # Asset files
├── components/         # Reusable UI components
│   ├── booking/        # Booking specific components (BookingForm, BookingsTable)
│   └── common/         # Common UI components (Button, Input, Select, Spinner)
├── services/           # Service layer for API integrations (apiService using Axios)
├── types/              # TypeScript global definitions & interfaces
├── App.tsx             # Main layout and state orchestration
├── index.css           # Global layout & premium theme setup
└── main.tsx            # Application entrypoint
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the application in development mode:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local address (typically `http://localhost:5173`).
