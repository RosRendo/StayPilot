// StayPilot Shared Enums & Types

export enum PlatformRole {
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
}

export enum HotelRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
}

export enum HousekeepingStatus {
  CLEAN = 'CLEAN',
  DIRTY = 'DIRTY',
  INSPECTED = 'INSPECTED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum BookingSource {
  DIRECT_WEBSITE = 'DIRECT_WEBSITE',
  FRONT_DESK = 'FRONT_DESK',
  TELEGRAM_PHONE = 'TELEGRAM_PHONE',
  WALK_IN = 'WALK_IN',
}

export enum PaymentMethod {
  PAY_AT_HOTEL_CASH = 'PAY_AT_HOTEL_CASH',
  BANK_TRANSFER_KHQR = 'BANK_TRANSFER_KHQR',
  ABA_PAYWAY = 'ABA_PAYWAY',
  CREDIT_CARD = 'CREDIT_CARD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum SubscriptionTier {
  STARTER = 'STARTER',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
}

// -------------------------------------------------------------
// DTOs & Domain Models
// -------------------------------------------------------------

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  platformRole: PlatformRole;
  isActive: boolean;
  createdAt: string;
}

export interface HotelMembershipDto {
  id: string;
  userId: string;
  hotelId: string;
  role: HotelRole;
  createdAt: string;
}

export interface HotelDto {
  id: string;
  slug: string;
  name: string;
  descriptionKh?: string | null;
  descriptionEn?: string | null;
  tagline?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  galleryUrls: string[];
  addressLine: string;
  city: string;
  province?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  email: string;
  phone: string;
  telegramUsername?: string | null;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy?: string | null;
  defaultCurrency: string;
  usdToKhrRate: number;
  amenities: string[];
  isActive: boolean;
}

export interface RoomTypeDto {
  id: string;
  hotelId: string;
  name: string;
  slug: string;
  descriptionEn?: string | null;
  descriptionKh?: string | null;
  maxAdults: number;
  maxChildren: number;
  totalInventory: number;
  bedConfiguration: string;
  roomSizeSqm?: number | null;
  photos: string[];
  amenities: string[];
  basePriceInCents: number;
  isActive: boolean;
}

export interface RoomDto {
  id: string;
  hotelId: string;
  roomTypeId: string;
  roomNumber: string;
  floor?: number | null;
  housekeeping: HousekeepingStatus;
  notes?: string | null;
  isActive: boolean;
}

export interface RatePlanDto {
  id: string;
  roomTypeId: string;
  name: string;
  description?: string | null;
  priceModifierType: string;
  priceModifierValue: number;
  includesBreakfast: boolean;
  cancellationFreeHours: number;
  isActive: boolean;
}

export interface GuestDto {
  id: string;
  hotelId: string;
  fullName: string;
  email: string;
  phone: string;
  country?: string | null;
  nationalIdOrPassport?: string | null;
  notes?: string | null;
}

export interface ReservedRoomDto {
  id: string;
  reservationId: string;
  roomTypeId: string;
  roomId?: string | null;
  nightlyPriceInCents: number;
  roomType?: RoomTypeDto;
  assignedRoom?: RoomDto | null;
}

export interface ReservationDto {
  id: string;
  hotelId: string;
  guestId: string;
  bookingReference: string;
  checkInDate: string;
  checkOutDate: string;
  adultsCount: number;
  childrenCount: number;
  status: ReservationStatus;
  source: BookingSource;
  subtotalInCents: number;
  taxInCents: number;
  totalAmountInCents: number;
  currency: string;
  specialRequests?: string | null;
  internalStaffNotes?: string | null;
  holdExpiresAt?: string | null;
  createdAt: string;
  guest?: GuestDto;
  reservedRooms?: ReservedRoomDto[];
  payments?: PaymentDto[];
}

export interface PaymentDto {
  id: string;
  reservationId: string;
  amountInCents: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string | null;
  proofImageUrl?: string | null;
  notes?: string | null;
  settledAt?: string | null;
  createdAt: string;
}

// -------------------------------------------------------------
// Request / Response Contracts
// -------------------------------------------------------------

export interface CheckAvailabilityQuery {
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults?: number;
  children?: number;
}

export interface RoomAvailabilityResult {
  roomType: RoomTypeDto;
  availableRoomsCount: number;
  isAvailable: boolean;
  nightlyRateInCents: number;
  totalNights: number;
  totalPriceInCents: number;
  totalPriceInKhr: number;
}

export interface CreatePublicBookingRequest {
  hotelSlug: string;
  roomTypeId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adultsCount: number;
  childrenCount: number;
  guest: {
    fullName: string;
    email: string;
    phone: string;
    country?: string;
  };
  paymentMethod: PaymentMethod;
  specialRequests?: string;
}

export interface CreateStaffBookingRequest {
  roomTypeId: string;
  assignedRoomId?: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adultsCount: number;
  childrenCount: number;
  source: BookingSource;
  guest: {
    fullName: string;
    email: string;
    phone: string;
  };
  customPriceInCents?: number;
  specialRequests?: string;
  internalStaffNotes?: string;
}

// -------------------------------------------------------------
// Financial & Currency Utilities
// -------------------------------------------------------------

export function centsToUsd(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

export function usdToCents(usd: number): number {
  return Math.round(usd * 100);
}

export function usdCentsToKhr(cents: number, exchangeRate: number = 4100): number {
  const usd = cents / 100;
  return Math.round(usd * exchangeRate);
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatKhr(khrAmount: number): string {
  return `${khrAmount.toLocaleString('en-US')} ៛`;
}
