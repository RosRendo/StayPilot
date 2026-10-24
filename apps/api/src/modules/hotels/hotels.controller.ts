import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HotelRole } from '@staypilot/shared-types';

@Controller('hotels')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Get('current')
  async getCurrentHotel(@Req() req: any) {
    return this.hotelsService.getHotelById(req.hotelId);
  }

  @Patch('current')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER)
  async updateCurrentHotel(@Req() req: any, @Body() body: any) {
    return this.hotelsService.updateHotel(req.hotelId, body);
  }
}
