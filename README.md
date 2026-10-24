# 🏨 StayPilot — Hotel Booking & Operations SaaS for Cambodia

**StayPilot** is a production-minded multi-tenant hotel booking and front-desk management SaaS built specifically for small and independent boutique hotels, guesthouses, and eco-resorts in Cambodia (Siem Reap, Phnom Penh, Kampot, Koh Rong).

It gives each property a branded, direct booking website to bypass high OTA commissions, alongside a clean front-desk dashboard to eliminate double bookings across walk-ins, phone calls, Telegram, and online reservations.

---

## 🛠️ Architecture & Technology Stack

- **Monorepo**: npm workspaces (`apps/web`, `apps/api`, `packages/shared-types`)
- **Frontend (`apps/web`)**: Next.js 14+ (App Router), React 18, Tailwind CSS, Lucide Icons
- **Backend API (`apps/api`)**: NestJS (Modular Monolith), Passport JWT, class-validator
- **Database & ORM**: PostgreSQL 16 with Prisma ORM
- **Testing**: Jest unit/integration tests & Playwright
- **Local Dev**: Docker Compose for PostgreSQL 16

---

## 🎨 Hospitality Design System
- **Ivory Warmth**: Backgrounds (`#FAF8F5`, `#F5F1EB`)
- **Khmer Forest Green**: Primary brand accents (`#143823`, `#0C2416`)
- **Champagne Gold**: Subtle highlights (`#C8A97E`, `#BA9255`)
- **Slate Charcoal**: High-legibility typography (`#19211E`)
- **Bilingual**: English & Khmer script (*Kantumruy Pro* / *Battambang*)
- **Dual Currency**: Live USD ($) and Cambodian Riel (៛) rates

---

## 🚀 Quick Start Guide

### 1. Start PostgreSQL with Docker
```bash
docker compose up -d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client & Run Seed
```bash
# Push schema to database
npm run prisma:push --workspace=apps/api

# Seed realistic Cambodian boutique hotel data
npm run prisma:seed --workspace=apps/api
```

### 4. Start Development Servers
```bash
# Starts both Next.js (port 3000) and NestJS API (port 4000)
npm run dev
```

---

## 🧭 Key Routes

### Public Guest Booking Experience
- **SaaS Homepage**: `http://localhost:3000`
- **Hotel Showcase**: `http://localhost:3000/hotels/angkor-pavilion`
- **Direct Booking Checkout**: `http://localhost:3000/book/angkor-pavilion`
- **Confirmation Voucher**: `http://localhost:3000/booking/confirmation/SP-2610-8421`

### Hotel Front-Desk Operations Dashboard
- **Owner Login**: `http://localhost:3000/dashboard/login`  
  *Credentials*: `owner@angkorpavilion.com` / `Password123!`
- **Today's Overview**: `http://localhost:3000/dashboard` (Arrivals, Departures, Occupancy)
- **Reservation Tape-Chart**: `http://localhost:3000/dashboard/calendar`
- **Housekeeping Board**: `http://localhost:3000/dashboard/rooms`
- **Reservations & Walk-Ins**: `http://localhost:3000/dashboard/reservations`
- **Revenue Analytics**: `http://localhost:3000/dashboard/reports`

---

## 🛡️ Double-Booking Prevention Logic
StayPilot utilizes a dual-tier inventory model:
1. **Pessimistic Row Lock (`SELECT ... FOR UPDATE`)**: All reservation requests lock the room category row inside a PostgreSQL transaction.
2. **Atomic Date Overlap Verification**: Checks that $\text{ActiveReservations}(date) < \text{TotalRooms}$ for every night in $[checkIn, checkOut)$.
3. **15-Minute Temporary Hold**: Pending payments release inventory automatically after 15 minutes.
4. **Physical Room Collision Guard**: Checks that no assigned room is double-booked across overlapping dates.
