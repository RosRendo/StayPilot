import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../../database/prisma.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { ReservationStatus, BookingSource } from '@staypilot/shared-types';

describe('ReservationsService — Double-Booking Shield & Business Logic', () => {
  let service: ReservationsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn(async (cb) => cb(prisma)),
      roomType: {
        findFirst: jest.fn(),
      },
      reservedRoom: {
        count: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      guest: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      reservation: {
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      room: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should reject booking if checkOut date is before checkIn date', async () => {
    await expect(
      service.createStaffReservation('hotel-1', {
        roomTypeId: 'rt-1',
        checkInDate: '2026-10-28',
        checkOutDate: '2026-10-25', // Invalid: checkOut before checkIn
        adultsCount: 2,
        source: BookingSource.FRONT_DESK,
        guest: { fullName: 'Test Guest', phone: '012345678' },
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should prevent double booking when all rooms in category are sold out', async () => {
    // Total inventory is 3
    prisma.roomType.findFirst.mockResolvedValue({
      id: 'rt-1',
      name: 'Deluxe King',
      totalInventory: 3,
      basePriceInCents: 4500,
    });

    // Overlapping active bookings is already 3
    prisma.reservedRoom.count.mockResolvedValue(3);

    await expect(
      service.createStaffReservation('hotel-1', {
        roomTypeId: 'rt-1',
        checkInDate: '2026-10-25',
        checkOutDate: '2026-10-28',
        adultsCount: 2,
        source: BookingSource.FRONT_DESK,
        guest: { fullName: 'Test Guest', phone: '012345678' },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should prevent physical room collision when a specific room is already assigned', async () => {
    prisma.roomType.findFirst.mockResolvedValue({
      id: 'rt-1',
      name: 'Deluxe King',
      totalInventory: 3,
      basePriceInCents: 4500,
    });

    // 1 room sold out in pool of 3 (still 2 left)
    prisma.reservedRoom.count.mockResolvedValue(1);

    // But Room 101 specifically is already occupied
    prisma.reservedRoom.findFirst.mockResolvedValue({
      id: 'rr-conflict',
      roomId: 'room-101',
    });

    await expect(
      service.createStaffReservation('hotel-1', {
        roomTypeId: 'rt-1',
        assignedRoomId: 'room-101',
        checkInDate: '2026-10-25',
        checkOutDate: '2026-10-28',
        adultsCount: 2,
        source: BookingSource.FRONT_DESK,
        guest: { fullName: 'Test Guest', phone: '012345678' },
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should automatically mark room DIRTY when reservation is checked out', async () => {
    prisma.reservation.findFirst.mockResolvedValue({
      id: 'res-123',
      hotelId: 'hotel-1',
      reservedRooms: [{ id: 'rr-1', roomId: 'room-101' }],
    });

    prisma.reservation.update.mockResolvedValue({
      id: 'res-123',
      status: ReservationStatus.CHECKED_OUT,
    });

    await service.updateStatus('hotel-1', 'res-123', ReservationStatus.CHECKED_OUT);

    expect(prisma.room.update).toHaveBeenCalledWith({
      where: { id: 'room-101' },
      data: { housekeeping: 'DIRTY' },
    });
  });
});
