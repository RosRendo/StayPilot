# 🧭 StayPilot — Route Hierarchy & API Contract

## 1. Next.js Frontend Route Hierarchy

### A. Public & Guest Experience
| Route | Access | Purpose & Features |
| :--- | :--- | :--- |
| `/` | Public | SaaS Landing Page (Value prop, pricing tiers: $9, $19, $39, hotel demo link) |
| `/hotels/[slug]` | Public | Hotel Showcase (Photos, description in EN/KH, amenities, policies, location map) |
| `/hotels/[slug]/rooms/[roomTypeId]` | Public | Room Type Deep Dive (Bed size, amenities, high-res gallery, rate plans) |
| `/book/[hotelSlug]` | Public | Direct Booking Funnel (Date range picker, guest counter, room selection, guest contact form, payment choice: Cash/KHQR) |
| `/booking/confirmation/[reference]` | Public | Printable Verified Voucher (QR code, hotel contact, check-in instructions, status) |

### B. Multi-Tenant Hotel Dashboard (`/dashboard`)
*Requires authenticated session with `hotelId` claim and proper `HotelRole`.*

| Route | Minimum Role | Key Functionality |
| :--- | :--- | :--- |
| `/dashboard` | `RECEPTIONIST` | Today's Overview: Arrivals, Departures, In-House, Occupancy %, Quick Walk-in button |
| `/dashboard/calendar` | `RECEPTIONIST` | Tape-Chart visual timeline with date scrubbing and color-coded statuses |
| `/dashboard/reservations` | `RECEPTIONIST` | Searchable reservations table (Filter by status, date, source; Manual booking modal) |
| `/dashboard/reservations/[id]` | `RECEPTIONIST` | Reservation detail (Assign physical room, check-in/out, log payments, notes) |
| `/dashboard/rooms` | `MANAGER` | Room types list & physical room inventory with live housekeeping status toggles |
| `/dashboard/pricing` | `MANAGER` | Rate plans, seasonal pricing, weekend adjustments, breakfast add-on rules |
| `/dashboard/guests` | `RECEPTIONIST` | Guest CRM directory (Stay history, contact details, VIP/special notes) |
| `/dashboard/reports` | `OWNER` | Revenue reports, ADR (Average Daily Rate), RevPAR, occupancy analytics |
| `/dashboard/staff` | `OWNER` | Staff invitation, role assignments (Manager, Receptionist), access revocation |
| `/dashboard/settings` | `OWNER` | Hotel profile, Khmer/English descriptions, photos, bank account/KHQR setup |

### C. Platform Superadmin (`/admin`)
*Requires `platformRole: SUPERADMIN`.*

| Route | Purpose |
| :--- | :--- |
| `/admin/hotels` | Manage onboarded hotels, verify accounts, toggle active status |
| `/admin/subscriptions` | Monitor subscription plans (Starter, Pro, Business), trial expirations, billing status |
| `/admin/settings` | Platform-wide defaults, default exchange rates (USD to KHR), system health |

---

## 2. NestJS REST API Contract (`/api/v1`)

### Authentication & Tenant Scoping (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register hotel owner & create new property
- `POST /api/v1/auth/login` — Returns JWT Access Token + HttpOnly Refresh Token
- `POST /api/v1/auth/refresh` — Refresh access token
- `GET  /api/v1/auth/me` — Current user profile and hotel memberships

### Public Booking Engine (`/api/v1/public`)
- `GET  /api/v1/public/hotels/:slug` — Get public hotel profile, amenities, policies
- `GET  /api/v1/public/hotels/:slug/availability` — Check room availability for date range `?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&adults=N`
- `POST /api/v1/public/bookings` — Create direct reservation (atomic lock, sets 15-min hold)
- `GET  /api/v1/public/bookings/:reference` — Fetch booking voucher details by reference code

### Hotel Dashboard Operations (`/api/v1/dashboard`)
*Protected by `JwtAuthGuard` & `TenantGuard`*

#### Reservations & Front Desk
- `GET    /api/v1/reservations` — List reservations with date/status filters
- `POST   /api/v1/reservations` — Create manual front-desk / walk-in booking
- `GET    /api/v1/reservations/:id` — Get reservation details
- `PATCH  /api/v1/reservations/:id/assign-room` — Assign physical room
- `PATCH  /api/v1/reservations/:id/status` — Transition status (`CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`)
- `POST   /api/v1/reservations/:id/payments` — Log manual cash/transfer payment

#### Rooms & Inventory
- `GET    /api/v1/room-types` — List room categories
- `POST   /api/v1/room-types` — Create room category
- `PUT    /api/v1/room-types/:id` — Update room category (capacity, photos, base price)
- `GET    /api/v1/rooms` — List physical rooms with housekeeping status
- `POST   /api/v1/rooms` — Create physical room (e.g., "Room 101")
- `PATCH  /api/v1/rooms/:id/housekeeping` — Update housekeeping status (`CLEAN`, `DIRTY`, `INSPECTED`)

#### Rate Plans & Pricing
- `GET    /api/v1/rate-plans` — List rate plans for hotel
- `POST   /api/v1/rate-plans` — Create rate plan (breakfast included, weekend surge)

#### Analytics & Reports
- `GET    /api/v1/reports/summary` — Daily summary (Arrivals, Departures, Occupancy %)
- `GET    /api/v1/reports/revenue` — Monthly revenue, ADR, RevPAR breakdown

### Webhooks & Payments (`/api/v1/webhooks`)
- `POST   /api/v1/webhooks/aba-payway` — Handle verified ABA PayWay callbacks (HMAC-SHA512 verified)
