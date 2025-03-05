import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // simultating performance testing for long running tasks
  @Get('sync-block')
  async syncBlock(): Promise<string> {
    function longRunningTask() {
      const start = Date.now();
      while (Date.now() - start < 5000) {} // Block for 5 seconds
    }

    longRunningTask();
    return 'Completed';
  }
}
