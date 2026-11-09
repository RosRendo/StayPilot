# 🏨 StayPilot — Hotel Booking & Operations SaaS for Cambodia

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black.svg?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E.svg?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)
![Bakong KHQR](https://img.shields.io/badge/Bakong-KHQR_Integrated-D32F2F)
![ABA PayWay](https://img.shields.io/badge/ABA-PayWay-003366)
![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-f69220.svg?logo=pnpm)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

**Production-grade multi-tenant hotel booking and front-desk management SaaS built specifically for boutique hotels, guesthouses, and eco-resorts across Cambodia (Siem Reap, Phnom Penh, Kampot, Koh Rong).**

[System Architecture](#-system-architecture) • [Database ERD](#-database-entity-relationship-erd) • [Booking Flow](#-guest-direct-booking--operations-flow) • [Quick Start](#-quick-start-guide)

</div>

---

## ⚡ Overview

**StayPilot** is an all-in-one hospitality engine designed to eliminate expensive OTA commissions. It delivers a fast, mobile-first direct booking guest portal with instantaneous **Bakong KHQR** and **ABA PayWay** checkout, alongside an operational front-desk calendar, housekeeping manager, and automated **Telegram** booking notification bot.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Clients["🖥️ Frontend Clients (Next.js 14 App Router)"]
        PublicBooking["🌐 Public Hotel Booking Portal<br/>(/hotel/:slug)"]
        GuestCheckout["💳 Guest Checkout & KHQR<br/>(/hotel/:slug/book)"]
        AdminPortal["📊 Hotel Operations Dashboard<br/>(/admin/calendar /rooms /rates)"]
    end

    subgraph Backend["⚡ NestJS Modular Monolith API (Port 4000)"]
        AuthModule["Auth & RBAC Module<br/>(JWT + HttpOnly Cookies)"]
        HotelModule["Multi-Tenant Hotel Engine<br/>(Isolation by hotel_id)"]
        BookingModule["Booking & Rate Engine<br/>(Inventory Locking & Concurrency)"]
        PaymentModule["Payment Engine<br/>(ABA PayWay & Bakong KHQR)"]
        HousekeepingModule["Housekeeping & Room State Manager"]
    end

    subgraph Database["💾 PostgreSQL 16 via Prisma ORM"]
        Hotels[("hotels & hotel_memberships")]
        Rooms[("room_types & rooms")]
        Bookings[("reservations & reserved_rooms")]
        Guests[("guests & payments")]
        Audit[("audit_logs & subscriptions")]
    end

    subgraph Integrations["🇰🇭 Cambodian Ecosystem"]
        PayWay["💳 ABA PayWay Gateway<br/>(Instant Deep Link)"]
        Bakong["🏦 Bakong KHQR<br/>(NBC EMVCo Standard)"]
        Telegram["📱 Telegram Bot API<br/>(Instant Reservation Pings)"]
    end

    PublicBooking --> BookingModule
    GuestCheckout --> PaymentModule
    AdminPortal --> AuthModule
    AuthModule --> HotelModule
    HotelModule --> Database
    BookingModule --> Database
    PaymentModule --> PayWay
    PaymentModule --> Bakong
    BookingModule --> Telegram
    HousekeepingModule --> Database
```

---

## 📊 Database Entity Relationship (ERD)

```mermaid
erDiagram
    HOTEL ||--o{ HOTEL_MEMBERSHIP : employs
    USER ||--o{ HOTEL_MEMBERSHIP : holds
    HOTEL ||--o{ ROOM_TYPE : offers
    HOTEL ||--o{ ROOM : contains
    HOTEL ||--o{ RESERVATION : receives
    HOTEL ||--o{ GUEST : registers
    ROOM_TYPE ||--o{ ROOM : defines
    ROOM_TYPE ||--o{ RATE_PLAN : configures
    RESERVATION ||--o{ RESERVED_ROOM : includes
    RESERVATION ||--o{ PAYMENT : records
    GUEST ||--o{ RESERVATION : books

    HOTEL {
        uuid id PK
        string slug UK
        string name
        string city
        string address_line
        string default_currency
        int usd_to_khr_rate
        string telegram_username
        boolean is_active
    }

    USER {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        string platform_role
    }

    HOTEL_MEMBERSHIP {
        uuid id PK
        uuid user_id FK
        uuid hotel_id FK
        string role
    }

    ROOM_TYPE {
        uuid id PK
        uuid hotel_id FK
        string name
        string slug
        int max_adults
        int total_inventory
        int base_price_in_cents
    }

    ROOM {
        uuid id PK
        uuid hotel_id FK
        uuid room_type_id FK
        string room_number
        string housekeeping_status
    }

    RESERVATION {
        uuid id PK
        uuid hotel_id FK
        uuid guest_id FK
        string confirmation_code UK
        date check_in_date
        date check_out_date
        string status
        int total_amount_in_cents
    }

    GUEST {
        uuid id PK
        uuid hotel_id FK
        string full_name
        string email
        string phone_number
        string nationality
    }

    PAYMENT {
        uuid id PK
        uuid reservation_id FK
        int amount_in_cents
        string currency
        string provider
        string status
    }
```

---

## 🔄 Guest Direct Booking & Operations Flow

```mermaid
sequenceDiagram
    autonumber
    actor Guest as 🧳 Traveler
    participant Web as 🌐 StayPilot Web (Next.js)
    participant API as ⚡ NestJS API
    participant DB as 💾 PostgreSQL
    participant Bank as 💳 ABA PayWay / KHQR
    actor Desk as 🏨 Hotel Front-Desk

    Guest->>Web: Selects dates & room type on Direct Hotel Page
    Web->>API: GET /api/v1/hotels/:slug/availability?checkIn=&checkOut=
    API->>DB: Query available room inventory (locking against overlap)
    API-->>Web: Available rooms and rate plans
    Guest->>Web: Fills guest details & chooses Bakong KHQR
    Web->>API: POST /api/v1/hotels/:slug/bookings
    API->>DB: Create Reservation (Status: PENDING)
    API->>Bank: Generate dynamic KHQR payment code
    API-->>Web: Confirmation code & QR string
    Guest->>Bank: Scans and settles with Banking App
    Bank->>API: POST /api/v1/payments/webhook
    API->>DB: Mark Reservation CONFIRMED & Payment PAID
    API->>Desk: 🔔 Telegram Alert: New booking confirmed!
    Desk->>Web: Front-Desk calendar auto-updates via live query
```

---

## 🎨 Hospitality Design System
- **Ivory Warmth**: Backgrounds (`#FAF8F5`, `#F5F1EB`)
- **Khmer Forest Green**: Primary brand accents (`#143823`, `#0C2416`)
- **Champagne Gold**: Subtle highlights (`#C8A97E`, `#BA9255`)
- **Slate Charcoal**: High-legibility typography (`#19211E`)
- **Dual Script & Currency**: Khmer (*Kantumruy Pro*) & English (*Inter*), real-time USD ($) and Riel (KHR) conversion.

---

## 🚀 Quick Start Guide

### 1. Start PostgreSQL with Docker
```bash
docker compose up -d
```

### 2. Install Dependencies (Monorepo with pnpm)
```bash
pnpm install
```

### 3. Generate Prisma Client & Run Seed
```bash
# Push schema to database
pnpm --filter api run prisma:push

# Seed realistic Cambodian boutique hotel data
pnpm --filter api run prisma:seed
```

### 4. Start Development Servers
```bash
# Starts both Next.js (port 3000) and NestJS API (port 4000)
pnpm run dev
```

---

## 📄 License
MIT License © **[Ros Rendo](https://github.com/RosRendo)**
