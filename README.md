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

## Design Choices (কোন Design ব্যবহার করা হয়েছে)

1. Premium Custom CSS:
   - কোনো সিএসএস ফ্রেমওয়ার্ক (যেমন Tailwind বা Bootstrap) ব্যবহার না করে সম্পূর্ণ কাস্টম ভ্যানিলা সিএসএস (Vanilla CSS) এবং সিএসএস ভেরিয়েবল (HSL custom properties) দিয়ে ডিজাইন করা হয়েছে।
   - এর ফলে ডিজাইনটির কাস্টমাইজেশন এবং পারফরম্যান্স অনেক উন্নত হয়েছে।
2. Glassmorphism & Dark Theme:
   - মডার্ন এবং প্রিমিয়াম লুক দেওয়ার জন্য গ্লাসমরফিজম (Glassmorphism) ইফেক্ট এবং ডার্ক মোড থিম ব্যবহার করা হয়েছে।
3. Typography & Micro-animations:
   - গুগল ফন্ট "Outfit" ব্যবহার করে প্রফেশনাল টাইপোগ্রাফি নিশ্চিত করা হয়েছে এবং ইউজার এক্সপেরিয়েন্স বাড়াতে বাটন হভার এবং ট্রানজিশনে মাইক্রো-অ্যানিমেশন ব্যবহার করা হয়েছে।

---

## Prevention of Overbooking (Overbooking কীভাবে বন্ধ করা হয়েছে)

1. Database Pessimistic Locking:
   - যখন ব্যাকএন্ডের ব্যাকগ্রাউন্ড ওয়ার্কার কোনো টিকিট বুকিং প্রসেস করে, তখন সেটি ডেটাবেজ লেভেলে Pessimistic Write Lock (SELECT ... FOR UPDATE) ব্যবহার করে টিকিট বুক করে। এর ফলে একই সময়ে একাধিক ট্রানজেকশন একসাথে একই ইভেন্টের টিকিট কাটতে পারে না।
2. Asynchronous Queue (BullMQ):
   - একই সময়ে হাজার হাজার ব্যবহারকারী বুকিং রিকোয়েস্ট করলেও ব্যাকএন্ডে BullMQ এবং Redis ব্যবহার করে সেগুলোকে কিউতে সারিবদ্ধ করা হয় এবং একে একে প্রসেস করা হয়।
3. UI Seat Validation:
   - ফ্রন্টএন্ডে রিয়েল-টাইম এপিআই রেসপন্স থেকে ইভেন্টের অবশিষ্ট সিটের সংখ্যা পরীক্ষা করে ফর্মে ভ্যালিডেশন বসানো হয়েছে। সিট সংখ্যা খালি সিটের চেয়ে বেশি হলে বুকিং সাবমিট করা যায় না।

---

## Handling Duplicate Bookings (Duplicate Booking কীভাবে Handle করা হয়েছে)

1. Idempotency Key (request_id):
   - ফ্রন্টএন্ড থেকে প্রতিটি বুকিং সাবমিশনের সময় একটি ইউনিক `request_id` (টাইমস্ট্যাম্প এবং র্যান্ডম স্ট্রিংয়ের সমন্বয়ে) জেনারেট করে পাঠানো হয়।
2. Database Unique Constraint:
   - ডেটাবেজে `request_id` ফিল্ডটি ইউনিক করা আছে। কোনো কারণে ইউজার সাবমিট বাটনে ডাবল ক্লিক করলে বা নেটওয়ার্ক ইররের কারণে রিকোয়েস্ট রিট্রাই হলে সেকেন্ডারি রিকোয়েস্টটি ডেটাবেজ রিজেক্ট করে দেয়।
3. UI State Management:
   - ফর্ম সাবমিট করার সময় সাবমিট বাটনটি `disabled` করে দেওয়া হয় এবং `loading` স্টেট দেখানো হয়, যা ফ্রন্টএন্ড লেভেলে ডাবল ক্লিক প্রতিরোধ করে।

---

## Future Improvements (আরও সময় পেলে কী কী উন্নত করা যেত)

1. WebSockets / Server-Sent Events (SSE):
   - বর্তমানে প্রতি ৩ সেকেন্ড পর পর এপিআই পোলিং (polling) এর মাধ্যমে ডেটা আপডেট করা হচ্ছে। আরও সময় পেলে রিয়েল-টাইম কমিউনিকেশনের জন্য WebSockets বা SSE ব্যবহার করা যেত।
2. User Authentication:
   - ব্যবহারকারীদের জন্য একটি সাইন-ইন/রেজিস্ট্রেশন সিস্টেম (যেমন JWT বা OAuth) যুক্ত করা যেত যাতে প্রত্যেকে নিজের বুকিং হিস্ট্রি আলাদাভাবে দেখতে পারে।
3. Email Notification System:
   - বুকিং সফল বা ব্যর্থ হলে ব্যবহারকারীকে ইমেইল বা এসএমএসের মাধ্যমে কনফার্মেশন টিকিট পাঠানোর ফিচার যুক্ত করা যেত।
4. Comprehensive Testing:
   - কোডের স্থায়িত্ব ও নিরাপত্তা বাড়ানোর জন্য Cypress বা Jest দিয়ে এন্ড-টু-এন্ড (E2E) এবং ইউনিট টেস্টিং যোগ করা যেত।
