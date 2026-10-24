import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RoomTypesService } from './room-types.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HotelRole } from '@staypilot/shared-types';

@Controller('room-types')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class RoomTypesController {
  constructor(private roomTypesService: RoomTypesService) {}

  @Get()
  async listRoomTypes(@Req() req: any) {
    return this.roomTypesService.listRoomTypes(req.hotelId);
  }

  @Get(':id')
  async getRoomType(@Req() req: any, @Param('id') id: string) {
    return this.roomTypesService.getRoomType(req.hotelId, id);
  }

  @Post()
  @Roles(HotelRole.OWNER, HotelRole.MANAGER)
  async createRoomType(@Req() req: any, @Body() body: any) {
    return this.roomTypesService.createRoomType(req.hotelId, body);
  }

  @Put(':id')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER)
  async updateRoomType(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.roomTypesService.updateRoomType(req.hotelId, id, body);
  }
}
