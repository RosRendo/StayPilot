import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HotelRole, ReservationStatus } from '@staypilot/shared-types';

@Controller('reservations')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @Get()
  async listReservations(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
  ) {
    return this.reservationsService.listReservations(req.hotelId, { status, startDate, endDate, search });
  }

  @Get(':id')
  async getReservation(@Req() req: any, @Param('id') id: string) {
    return this.reservationsService.getReservation(req.hotelId, id);
  }

  @Post()
  @Roles(HotelRole.OWNER, HotelRole.MANAGER, HotelRole.RECEPTIONIST)
  async createStaffReservation(@Req() req: any, @Body() body: any) {
    return this.reservationsService.createStaffReservation(req.hotelId, body);
  }

  @Patch(':id/assign-room')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER, HotelRole.RECEPTIONIST)
  async assignRoom(@Req() req: any, @Param('id') id: string, @Body('roomId') roomId: string) {
    return this.reservationsService.assignRoom(req.hotelId, id, roomId);
  }

  @Patch(':id/status')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER, HotelRole.RECEPTIONIST)
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: ReservationStatus,
  ) {
    return this.reservationsService.updateStatus(req.hotelId, id, status);
  }

  @Post(':id/payments')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER, HotelRole.RECEPTIONIST)
  async recordPayment(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.reservationsService.recordPayment(req.hotelId, id, body);
  }
}
