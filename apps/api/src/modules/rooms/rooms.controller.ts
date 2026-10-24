import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HotelRole, HousekeepingStatus } from '@staypilot/shared-types';

@Controller('rooms')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  async listRooms(@Req() req: any) {
    return this.roomsService.listRooms(req.hotelId);
  }

  @Post()
  @Roles(HotelRole.OWNER, HotelRole.MANAGER)
  async createRoom(@Req() req: any, @Body() body: any) {
    return this.roomsService.createRoom(req.hotelId, body);
  }

  @Patch(':id/housekeeping')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER, HotelRole.RECEPTIONIST)
  async updateHousekeeping(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: HousekeepingStatus,
  ) {
    return this.roomsService.updateHousekeeping(req.hotelId, id, status);
  }
}
