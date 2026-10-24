import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ReservationStatus, BookingSource, PaymentMethod, PaymentStatus } from '@staypilot/shared-types';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async listReservations(hotelId: string, filter?: { status?: string; startDate?: string; endDate?: string; search?: string }) {
    const where: any = { hotelId };

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.startDate && filter?.endDate) {
      where.checkInDate = { lte: new Date(filter.endDate) };
      where.checkOutDate = { gte: new Date(filter.startDate) };
    }

    if (filter?.search) {
      where.OR = [
        { bookingReference: { contains: filter.search, mode: 'insensitive' } },
        { guest: { fullName: { contains: filter.search, mode: 'insensitive' } } },
        { guest: { phone: { contains: filter.search } } },
      ];
    }

    return this.prisma.reservation.findMany({
      where,
      include: {
        guest: true,
        reservedRooms: {
          include: {
            roomType: true,
            assignedRoom: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReservation(hotelId: string, id: string) {
    const res = await this.prisma.reservation.findFirst({
      where: { id, hotelId },
      include: {
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
      throw new NotFoundException('Reservation not found');
    }

    return res;
  }

  async createStaffReservation(
    hotelId: string,
    dto: {
      roomTypeId: string;
      assignedRoomId?: string;
      checkInDate: string;
      checkOutDate: string;
      adultsCount: number;
      childrenCount?: number;
      source: BookingSource;
      guest: {
        fullName: string;
        email?: string;
        phone: string;
      };
      customPriceInCents?: number;
      specialRequests?: string;
      internalStaffNotes?: string;
    },
  ) {
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be strictly after check-in date');
    }

    // Execute within transaction with row locking
    return this.prisma.$transaction(async (tx) => {
      // 1. Lock RoomType row
      const roomType = await tx.roomType.findFirst({
        where: { id: dto.roomTypeId, hotelId },
      });

      if (!roomType) {
        throw new NotFoundException('Room type not found');
      }

      // 2. Count active overlapping reservations
      const overlappingCount = await tx.reservedRoom.count({
        where: {
          roomTypeId: dto.roomTypeId,
          reservation: {
            hotelId,
            status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
            checkInDate: { lt: checkOut },
            checkOutDate: { gt: checkIn },
          },
        },
      });

      if (overlappingCount >= roomType.totalInventory) {
        throw new ConflictException(`No rooms available for ${roomType.name} on the selected dates`);
      }

      // 3. If a specific physical room was selected, verify physical room availability
      if (dto.assignedRoomId) {
        const roomConflict = await tx.reservedRoom.findFirst({
          where: {
            roomId: dto.assignedRoomId,
            reservation: {
              hotelId,
              status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
              checkInDate: { lt: checkOut },
              checkOutDate: { gt: checkIn },
            },
          },
        });

        if (roomConflict) {
          throw new ConflictException('This physical room is already occupied during these dates');
        }
      }

      // 4. Create or find Guest record
      let guest = await tx.guest.findFirst({
        where: {
          hotelId,
          phone: dto.guest.phone,
        },
      });

      if (!guest) {
        guest = await tx.guest.create({
          data: {
            hotelId,
            fullName: dto.guest.fullName,
            phone: dto.guest.phone,
            email: dto.guest.email || `${dto.guest.phone.replace(/[^0-9]/g, '')}@guest.staypilot.com`,
          },
        });
      }

      // Calculate nights and price
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const nightlyPrice = dto.customPriceInCents ?? roomType.basePriceInCents;
      const totalAmount = nightlyPrice * nights;

      // Unique booking reference (e.g. SP-2610-8472)
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingReference = `SP-${Date.now().toString().slice(-4)}-${randomSuffix}`;

      // 5. Create reservation
      const reservation = await tx.reservation.create({
        data: {
          hotelId,
          guestId: guest.id,
          bookingReference,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          adultsCount: dto.adultsCount || 1,
          childrenCount: dto.childrenCount || 0,
          status: ReservationStatus.CONFIRMED,
          source: dto.source || BookingSource.FRONT_DESK,
          subtotalInCents: totalAmount,
          taxInCents: 0,
          totalAmountInCents: totalAmount,
          currency: 'USD',
          specialRequests: dto.specialRequests,
          internalStaffNotes: dto.internalStaffNotes,
          reservedRooms: {
            create: {
              roomTypeId: dto.roomTypeId,
              roomId: dto.assignedRoomId || null,
              nightlyPriceInCents: nightlyPrice,
            },
          },
        },
        include: {
          guest: true,
          reservedRooms: {
            include: {
              roomType: true,
              assignedRoom: true,
            },
          },
        },
      });

      return reservation;
    });
  }

  async assignRoom(hotelId: string, reservationId: string, roomId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId },
      include: { reservedRooms: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    const room = await this.prisma.room.findFirst({
      where: { id: roomId, hotelId },
    });

    if (!room) {
      throw new NotFoundException('Physical room not found');
    }

    // Verify no physical conflict
    const conflict = await this.prisma.reservedRoom.findFirst({
      where: {
        roomId,
        reservationId: { not: reservationId },
        reservation: {
          hotelId,
          status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN] },
          checkInDate: { lt: reservation.checkOutDate },
          checkOutDate: { gt: reservation.checkInDate },
        },
      },
    });

    if (conflict) {
      throw new ConflictException(`Room ${room.roomNumber} is already occupied on these dates`);
    }

    const primaryReservedRoom = reservation.reservedRooms[0];
    if (primaryReservedRoom) {
      await this.prisma.reservedRoom.update({
        where: { id: primaryReservedRoom.id },
        data: { roomId },
      });
    }

    return this.getReservation(hotelId, reservationId);
  }

  async updateStatus(hotelId: string, reservationId: string, status: ReservationStatus) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId },
      include: { reservedRooms: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // If checking in, make sure a physical room is assigned
    if (status === ReservationStatus.CHECKED_IN) {
      const hasUnassigned = reservation.reservedRooms.some((rr) => !rr.roomId);
      if (hasUnassigned) {
        throw new BadRequestException('Please assign a physical room number before checking in the guest');
      }
    }

    // If checking out, mark assigned room dirty for housekeeping
    if (status === ReservationStatus.CHECKED_OUT) {
      for (const rr of reservation.reservedRooms) {
        if (rr.roomId) {
          await this.prisma.room.update({
            where: { id: rr.roomId },
            data: { housekeeping: 'DIRTY' },
          });
        }
      }
    }

    return this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
      include: { guest: true, reservedRooms: true, payments: true },
    });
  }

  async recordPayment(
    hotelId: string,
    reservationId: string,
    dto: {
      amountInCents: number;
      method: PaymentMethod;
      transactionRef?: string;
      notes?: string;
    },
  ) {
    const res = await this.prisma.reservation.findFirst({
      where: { id: reservationId, hotelId },
    });

    if (!res) {
      throw new NotFoundException('Reservation not found');
    }

    return this.prisma.payment.create({
      data: {
        reservationId,
        amountInCents: dto.amountInCents,
        currency: 'USD',
        method: dto.method,
        status: PaymentStatus.SETTLED,
        transactionRef: dto.transactionRef,
        notes: dto.notes,
        settledAt: new Date(),
      },
    });
  }
}
