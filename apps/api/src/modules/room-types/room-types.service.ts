import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RoomTypesService {
  constructor(private prisma: PrismaService) {}

  async listRoomTypes(hotelId: string) {
    return this.prisma.roomType.findMany({
      where: { hotelId, isActive: true },
      include: {
        physicalRooms: true,
        ratePlans: true,
      },
      orderBy: { basePriceInCents: 'asc' },
    });
  }

  async getRoomType(hotelId: string, id: string) {
    const roomType = await this.prisma.roomType.findFirst({
      where: { id, hotelId },
      include: { physicalRooms: true, ratePlans: true },
    });

    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }

    return roomType;
  }

  async createRoomType(hotelId: string, data: any) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return this.prisma.roomType.create({
      data: {
        ...data,
        hotelId,
        slug,
      },
    });
  }

  async updateRoomType(hotelId: string, id: string, data: any) {
    return this.prisma.roomType.update({
      where: { id },
      data,
    });
  }
}
