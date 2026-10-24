import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ReservationStatus } from '@staypilot/shared-types';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDailySummary(hotelId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total rooms in property
    const totalRooms = await this.prisma.room.count({
      where: { hotelId, isActive: true },
    });

    // 2. Today's Arrivals
    const arrivals = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        checkInDate: { gte: today, lt: tomorrow },
        status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.PENDING] },
      },
      include: {
        guest: true,
        reservedRooms: { include: { roomType: true, assignedRoom: true } },
      },
    });

    // 3. Today's Departures
    const departures = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        checkOutDate: { gte: today, lt: tomorrow },
        status: { in: [ReservationStatus.CHECKED_IN] },
      },
      include: {
        guest: true,
        reservedRooms: { include: { roomType: true, assignedRoom: true } },
      },
    });

    // 4. Currently In-House
    const inHouse = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        status: ReservationStatus.CHECKED_IN,
      },
      include: {
        guest: true,
        reservedRooms: { include: { roomType: true, assignedRoom: true } },
      },
    });

    // 5. Occupancy calculation
    const occupiedCount = inHouse.length;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;

    return {
      date: today.toISOString().split('T')[0],
      totalRooms,
      occupiedRooms: occupiedCount,
      occupancyRate,
      arrivalsCount: arrivals.length,
      departuresCount: departures.length,
      inHouseCount: inHouse.length,
      arrivals,
      departures,
      inHouse,
    };
  }

  async getRevenueMetrics(hotelId: string) {
    // Current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const reservations = await this.prisma.reservation.findMany({
      where: {
        hotelId,
        createdAt: { gte: monthStart },
        status: { in: [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN, ReservationStatus.CHECKED_OUT] },
      },
    });

    const totalRevenueInCents = reservations.reduce((acc, r) => acc + r.totalAmountInCents, 0);
    const totalReservations = reservations.length;
    
    // Calculate total nights
    const totalNights = reservations.reduce((acc, r) => {
      const diff = Math.abs(r.checkOutDate.getTime() - r.checkInDate.getTime());
      return acc + (Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1);
    }, 0);

    const averageDailyRateInCents = totalNights > 0 ? Math.round(totalRevenueInCents / totalNights) : 0;

    return {
      month: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      totalRevenueInCents,
      totalReservations,
      totalNightsSold: totalNights,
      averageDailyRateInCents,
    };
  }
}
