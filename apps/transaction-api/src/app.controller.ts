import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { IServiceHealth } from './common/interfaces/serviceHealth.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getServiceHealth(
    @Query('deep') deep: 'one' | 'all' | 'none' = 'none'): Promise<IServiceHealth> {
    return this.appService.getServiceHealth(deep);
  }
}
