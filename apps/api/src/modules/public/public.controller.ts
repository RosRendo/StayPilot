import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('hotels/:slug')
  async getHotel(@Param('slug') slug: string) {
    return this.publicService.getHotelBySlug(slug);
  }

  @Get('hotels/:slug/availability')
  async checkAvailability(
    @Param('slug') slug: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('adults') adults?: string,
    @Query('children') children?: string,
  ) {
    return this.publicService.checkAvailability(
      slug,
      checkIn,
      checkOut,
      adults ? parseInt(adults, 10) : 2,
      children ? parseInt(children, 10) : 0,
    );
  }

  @Post('bookings')
  async createBooking(@Body() body: any) {
    return this.publicService.createPublicBooking(body);
  }

  @Get('bookings/:reference')
  async getBooking(@Param('reference') reference: string) {
    return this.publicService.getBookingByReference(reference);
  }
}
