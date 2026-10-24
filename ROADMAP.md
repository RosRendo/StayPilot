# 🗺️ StayPilot — Production MVP Roadmap & Milestone Plan

This roadmap outlines the disciplined, step-by-step development process for StayPilot. Each milestone is self-contained, testable, and produces verifiable deliverables.

---

## 🎯 Milestone 1: Monorepo Foundation & Database Scaffold
- **Goal**: Set up the Turborepo/npm workspace, Dockerized PostgreSQL 16, NestJS API with Prisma ORM, and Next.js 15 Tailwind setup.
- **Deliverables**:
  - `docker-compose.yml` for PostgreSQL 16 + pgAdmin
  - `apps/api` initialized with NestJS, Prisma schema, and healthcheck endpoint (`GET /api/v1/health`)
  - `apps/web` initialized with Next.js 15, Tailwind CSS, and Apple-grade calm hospitality design tokens
  - Verified database migration and connection.
- **Verification**: `npm run dev` boots both services without warnings; DB connection test passes.

---

## 🔐 Milestone 2: Multi-Tenant Auth, Tenancy & RBAC
- **Goal**: Secure authentication, tenant scoping, and hotel management.
- **Deliverables**:
  - JWT authentication with secure cookies / Bearer tokens and refresh tokens.
  - Multi-tenant role system: `PLATFORM_ADMIN`, `OWNER`, `MANAGER`, `RECEPTIONIST`.
  - `TenantInterceptor` / `TenantGuard` ensuring all requests are strictly scoped to the tenant's `hotelId`.
  - Hotel onboarding and profile management APIs (`POST /api/v1/hotels`, `GET /api/v1/hotels/me`).
- **Verification**: Automated integration tests verifying user registration, login, and rejection of cross-tenant data access (IDOR protection).

---

## 🛏️ Milestone 3: Room Inventory, Rate Plans & Housekeeping
- **Goal**: Manage room categories, physical rooms, and rates.
- **Deliverables**:
  - `RoomType` CRUD (capacity, bed types, photos, USD base prices, amenities).
  - Physical `Room` management (Room 101, 102, floor, housekeeping status: Clean/Dirty/Maintenance).
  - Flexible `RatePlan` system (Standard, Non-refundable, Weekend markups).
- **Verification**: Ability to create room categories and assign physical rooms; API tests validate room capacity limits and unique room numbers per hotel.

---

## 🛡️ Milestone 4: Concurrency-Proof Reservation Engine & Cart Holds
- **Goal**: Implement zero-double-booking reservation logic and availability calculations.
- **Deliverables**:
  - Nightly availability calculator across date ranges `[check_in, check_out)`.
  - Concurrency-safe booking creation wrapped in PostgreSQL transactions with `SELECT ... FOR UPDATE` row locks.
  - Temporary 15-minute booking hold (`holdExpiresAt`) engine to prevent inventory starvation.
  - Cancellation & modification workflows with full audit logging.
- **Verification**: Concurrent reservation simulation test (launching 2 simultaneous booking requests for the last remaining room; exactly one succeeds with 201, the other is gracefully rejected with 409 Conflict).

---

## 🌐 Milestone 5: Public Direct Booking Website (Guest Experience)
- **Goal**: High-converting direct booking site for each boutique hotel.
- **Deliverables**:
  - Dynamic hotel landing page at `/[hotelSlug]` (e.g. `/angkor-garden`).
  - Mobile-first, responsive date picker (check-in / check-out), adult/child selectors.
  - Real-time room availability display with instant price calculations.
  - Khmer (ភាសាខ្មែរ) & English language toggle.
  - Dual currency switch (USD / Cambodian Riel ៛ with live conversion rate).
  - Guest checkout form and verified voucher confirmation page with printable summary and booking reference.
- **Verification**: End-to-end guest booking journey from date selection to confirmation voucher.

---

## 📊 Milestone 6: Hotel Owner & Staff Dashboard
- **Goal**: Real-time operations center for front-desk staff and property owners.
- **Deliverables**:
  - "Today at a Glance": Today's arrivals, departures, currently in-house guests, and real-time occupancy %.
  - Visual Reservation Tape-Chart / Calendar view.
  - Walk-in / Manual reservation creator for front desk.
  - 1-click Check-In and Check-Out actions.
  - Housekeeping status toggles (Dirty ➔ In-Progress ➔ Clean).
  - Financial overview: Monthly revenue in USD/KHR, Average Daily Rate (ADR), RevPAR.
- **Verification**: Staff can receive a direct booking, assign Room 102, check the guest in, and mark the room clean upon checkout.

---

## 💳 Milestone 7: Payment Engine (Cash, KHQR & ABA PayWay) & Seed Data
- **Goal**: Realistic Cambodian payments, seed data, and production readiness.
- **Deliverables**:
  - Pay-at-Property / Cash on arrival workflow.
  - Bakong KHQR QR-code generator with payment slip upload.
  - Pluggable ABA PayWay webhook receiver with cryptographic HMAC validation and replay prevention.
  - Seed script with 2 realistic Cambodian properties (e.g. *Angkor Pavillion Boutique* in Siem Reap and *Mekong Haven Guesthouse* in Phnom Penh) with full photos, rooms, and historical reservations.
  - Jest & Playwright test suites.
- **Verification**: Full test suite passes; Docker container runs end-to-end.
