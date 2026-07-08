# WeNexus Event Booking System - Frontend

This is the frontend for the WeNexus Event Booking System built using React (TypeScript) and Vite.

---

## Core Features

1. Real-time Status Updates:
   - Polling logic automatically refreshes booking statuses (PENDING, CONFIRMED, FAILED) and event seat capacities every 3 seconds.
2. Dashboard Controls:
   - Filtering of bookings by Event and Status.
   - Client-side pagination.
   - Interactive loading states, loading spinners, and styled badges.

---

## Technical Stack

- Framework: React (v19) + Vite
- Language: TypeScript
- HTTP Client: Axios
- Styling: Vanilla CSS with HSL CSS Variables

---

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root of the frontend directory and add the backend API URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

---

## How to Run the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`.

---

## Design Choices

1. Premium Custom CSS:
   - Developed entirely with custom Vanilla CSS and CSS Variables (using HSL custom properties) without using heavy CSS frameworks (like Tailwind or Bootstrap).
   - This ensures full customization control, lightweight bundles, and faster rendering performance.
2. Glassmorphism & Dark Theme:
   - Built a sleek, modern dashboard utilizing glassmorphism effects and a cohesive dark mode color scheme.
3. Typography & Micro-animations:
   - Applied the Google Font "Outfit" for professional typography and introduced smooth transitions and button hover micro-animations to enhance user experience.

---

## Prevention of Overbooking

1. Database Pessimistic Locking:
   - The backend worker processes each ticket reservation request inside a database transaction with a Pessimistic Write Lock (SELECT ... FOR UPDATE). This prevents multiple concurrent transactions from booking the same seat simultaneously.
2. Asynchronous Queue (BullMQ):
   - To handle traffic spikes, all booking requests are queued using BullMQ and Redis, then processed sequentially by background workers.
3. UI Seat Validation:
   - The frontend validates user inputs against the real-time remaining seat capacity. If the requested seats exceed the available capacity, the form prevents submission.

---

## Handling Duplicate Bookings

1. Idempotency Key (request_id):
   - For every booking, the frontend generates and sends a unique `request_id` (using timestamp and a random string).
2. Database Unique Constraint:
   - The backend table applies a unique index constraint on the `request_id` column. If a network retry occurs or the user double-clicks, the database safely rejects duplicate entries.
3. UI State Management:
   - The submit button is immediately disabled and a loading state is shown during submission, preventing double-click submissions.

---

## Future Improvements

1. WebSockets / Server-Sent Events (SSE):
   - Replace the current 3-second HTTP polling mechanism with WebSockets or Server-Sent Events for instant, lightweight real-time updates.
2. User Authentication:
   - Implement user sign-in and registration (e.g., using JWT or OAuth) to allow users to view and track their personalized booking history.
3. Email Notification System:
   - Integrate an email service (like SendGrid or Twilio) to send ticket confirmation emails or status failure alerts directly to users.
4. Comprehensive Testing:
   - Add unit tests using Jest and end-to-end integration tests using Cypress to ensure stability and code reliability.
