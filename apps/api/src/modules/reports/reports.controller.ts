import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { HotelRole } from '@staypilot/shared-types';

@Controller('reports')
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('summary')
  async getDailySummary(@Req() req: any) {
    return this.reportsService.getDailySummary(req.hotelId);
  }

  @Get('revenue')
  @Roles(HotelRole.OWNER, HotelRole.MANAGER)
  async getRevenueMetrics(@Req() req: any) {
    return this.reportsService.getRevenueMetrics(req.hotelId);
  }
}
