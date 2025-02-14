import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsEvent implements OnModuleInit {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly metricsService: MetricsService,
  ) {}

  @OnEvent('userSignup.success')
  handleUserSignupEvent(payload: { userId: number }) {
    this.metricsService.trackBusinessSuccess('users', 'userSignup');
    console.log('Business Metric: User signup', payload);
    // Store in DB, push to analytics service, etc.
  }

  @OnEvent('order.success')
  handleOrderSuccessEvent(payload: {
    orderId: string;
    amount: number;
    userId: number;
  }) {
    console.log('Business Metric: Order Processed', payload);
    // Store in DB, push to analytics service, etc.
  }

  onModuleInit() {
    console.log('Metrics service initialized...');
  }
}
