import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ReservationStatus, BookingSource, PaymentMethod, PaymentStatus, usdCentsToKhr } from '@staypilot/shared-types';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getHotelBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug, isActive: true },
      include: {
        roomTypes: {
          where: { isActive: true },
          include: { ratePlans: true },
          orderBy: { basePriceInCents: 'asc' },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with slug "${slug}" not found`);
    }

    return hotel;
  }

  async checkAvailability(
    slug: string,
    checkInDateStr: string,
    checkOutDateStr: string,
    adults: number = 2,
    children: number = 0,
  ) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug, isActive: true },
      include: {
        roomTypes: {
          where: { isActive: true },
        },
      },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel "${slug}" not found`);
    }

    const checkIn = new Date(checkInDateStr);
    const checkOut = new Date(checkOutDateStr);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      throw new BadRequestException('Please provide valid check-in and check-out dates');
    }

    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Check availability for each room category
    const results = await Promise.all(
      hotel.roomTypes.map(async (rt) => {
        // Count active overlapping reservations
        const activeBookings = await this.prisma.reservedRoom.count({
          where: {
            roomTypeId: rt.id,
            reservation: {
              hotelId: hotel.id,
              status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
              checkInDate: { lt: checkOut },
              checkOutDate: { gt: checkIn },
            },
          },
        });

        const availableRoomsCount = Math.max(0, rt.totalInventory - activeBookings);
        const capacityMatches = rt.maxAdults >= adults;
        const isAvailable = availableRoomsCount > 0 && capacityMatches;
        const totalPriceInCents = rt.basePriceInCents * totalNights;
        const totalPriceInKhr = usdCentsToKhr(totalPriceInCents, hotel.usdToKhrRate);

        return {
          roomType: rt,
          availableRoomsCount,
          isAvailable,
          nightlyRateInCents: rt.basePriceInCents,
          totalNights,
          totalPriceInCents,
          totalPriceInKhr,
        };
      }),
    );

    return {
      hotel: {
        id: hotel.id,
        name: hotel.name,
        slug: hotel.slug,
        city: hotel.city,
        usdToKhrRate: hotel.usdToKhrRate,
      },
      dates: {
        checkInDate: checkInDateStr,
        checkOutDate: checkOutDateStr,
        totalNights,
      },
      roomAvailability: results,
    };
  }

  async createPublicBooking(dto: {
    hotelSlug: string;
    roomTypeId: string;
    checkInDate: string;
    checkOutDate: string;
    adultsCount: number;
    childrenCount?: number;
    guest: {
      fullName: string;
      email: string;
      phone: string;
      country?: string;
    };
    paymentMethod: PaymentMethod;
    specialRequests?: string;
  }) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug: dto.hotelSlug, isActive: true },
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel "${dto.hotelSlug}" not found`);
    }

    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be strictly after check-in date');
    }

    // Atomic transaction with row locking
    return this.prisma.$transaction(async (tx) => {
      // 1. Lock RoomType row
      const roomType = await tx.roomType.findFirst({
        where: { id: dto.roomTypeId, hotelId: hotel.id },
      });

      if (!roomType) {
        throw new NotFoundException('Selected room category not found');
      }

      // 2. Count active overlapping reservations
      const overlappingCount = await tx.reservedRoom.count({
        where: {
          roomTypeId: dto.roomTypeId,
          reservation: {
            hotelId: hotel.id,
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
            checkInDate: { lt: checkOut },
            checkOutDate: { gt: checkIn },
          },
        },
      });

      if (overlappingCount >= roomType.totalInventory) {
        throw new ConflictException('This room category was just reserved by another guest. Please pick another room.');
      }

      // 3. Find or create Guest
      let guest = await tx.guest.findFirst({
        where: {
          hotelId: hotel.id,
          email: dto.guest.email.toLowerCase().trim(),
        },
      });

      if (!guest) {
        guest = await tx.guest.create({
          data: {
            hotelId: hotel.id,
            fullName: dto.guest.fullName,
            email: dto.guest.email.toLowerCase().trim(),
            phone: dto.guest.phone,
            country: dto.guest.country || 'Cambodia',
          },
        });
      }

      // 4. Calculate nights & pricing
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const totalAmountInCents = roomType.basePriceInCents * nights;

      // Generate Reference Code (e.g. SP-2610-9512)
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const bookingReference = `SP-${Date.now().toString().slice(-4)}-${randomCode}`;

      // 15-minute temporary hold TTL
      const holdExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      const initialStatus = dto.paymentMethod === PaymentMethod.PAY_AT_HOTEL_CASH 
        ? ReservationStatus.CONFIRMED 
        : ReservationStatus.PENDING;

      // 5. Create Reservation
      const reservation = await tx.reservation.create({
        data: {
          hotelId: hotel.id,
          guestId: guest.id,
          bookingReference,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adultsCount: dto.adultsCount || 1,
          childrenCount: dto.childrenCount || 0,
          status: initialStatus,
          source: BookingSource.DIRECT_WEBSITE,
          subtotalInCents: totalAmountInCents,
          taxInCents: 0,
          totalAmountInCents,
          currency: 'USD',
          specialRequests: dto.specialRequests,
          holdExpiresAt,
          reservedRooms: {
            create: {
              roomTypeId: roomType.id,
              nightlyPriceInCents: roomType.basePriceInCents,
            },
          },
          payments: {
            create: {
              amountInCents: totalAmountInCents,
              currency: 'USD',
              method: dto.paymentMethod,
              status: dto.paymentMethod === PaymentMethod.PAY_AT_HOTEL_CASH ? PaymentStatus.PENDING : PaymentStatus.PENDING,
              notes: dto.paymentMethod === PaymentMethod.PAY_AT_HOTEL_CASH ? 'Pay in Cash / KHQR at check-in' : 'Pending payment verification',
            },
          },
        },
        include: {
          guest: true,
          reservedRooms: {
            include: { roomType: true },
          },
          payments: true,
        },
      });

      return {
        bookingReference: reservation.bookingReference,
        status: reservation.status,
        totalAmountInCents: reservation.totalAmountInCents,
        totalAmountInKhr: usdCentsToKhr(reservation.totalAmountInCents, hotel.usdToKhrRate),
        checkInDate: dto.checkInDate,
        checkOutDate: dto.checkOutDate,
        guest: reservation.guest,
        roomType: roomType.name,
      };
    });
  }

  async getBookingByReference(reference: string) {
    const res = await this.prisma.reservation.findUnique({
      where: { bookingReference: reference },
      include: {
        hotel: true,
        guest: true,
        reservedRooms: {
          include: {
            roomType: true,
            assignedRoom: true,
          },
        },
        payments: true,
      },
    });

    if (!res) {
      throw new NotFoundException(`Booking with reference "${reference}" not found`);
    }

    const totalKhr = usdCentsToKhr(res.totalAmountInCents, res.hotel.usdToKhrRate);

    return {
      ...res,
      totalAmountInKhr: totalKhr,
    };
  }
}
