import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MetricsEvent } from './metrics.event';

@Module({
  controllers: [MetricsController],
  providers: [MetricsService, MetricsEvent],
  exports: [MetricsService, MetricsEvent],
})
export class MetricsModule {}
