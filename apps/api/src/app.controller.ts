import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'StayPilot API',
      timestamp: new Date().toISOString(),
      country: 'Cambodia',
      version: '1.0.0',
    };
  }
}
