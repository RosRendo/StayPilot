import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { HousekeepingStatus } from '@staypilot/shared-types';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async listRooms(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.room.findMany({
      where: { hotelId, isActive: true },
      include: {
        roomType: true,
        reservedRooms: {
          where: {
            reservation: {
              status: { in: ['CONFIRMED', 'CHECKED_IN'] },
              checkInDate: { lte: today },
              checkOutDate: { gt: today },
            },
          },
          include: {
            reservation: {
              include: { guest: true },
            },
          },
        },
      },
      orderBy: { roomNumber: 'asc' },
    });
  }

  async createRoom(hotelId: string, data: { roomNumber: string; roomTypeId: string; floor?: number; notes?: string }) {
    const existing = await this.prisma.room.findFirst({
      where: { hotelId, roomNumber: data.roomNumber },
    });

    if (existing) {
      throw new ConflictException(`Room number ${data.roomNumber} already exists in this hotel`);
    }

    return this.prisma.room.create({
      data: {
        hotelId,
        roomNumber: data.roomNumber,
        roomTypeId: data.roomTypeId,
        floor: data.floor || 1,
        notes: data.notes,
        housekeeping: HousekeepingStatus.CLEAN,
      },
    });
  }

  async updateHousekeeping(hotelId: string, roomId: string, status: HousekeepingStatus) {
    const room = await this.prisma.room.findFirst({
      where: { id: roomId, hotelId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.prisma.room.update({
      where: { id: roomId },
      data: { housekeeping: status },
    });
  }
}
