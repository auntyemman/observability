import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsEvent {
  constructor(private readonly metricsService: MetricsService) {
    console.log('MetricsEvent Listener Initialized');
  }

  @OnEvent('userSignup.success', { async: true })
  handleUserSignupEvent(payload: any) {
    console.log('Received user signup event:', payload);
    this.metricsService.trackBusinessSuccess('users', 'userSignup');
  }

  @OnEvent('order.success', { async: true })
  handleOrderSuccessEvent(payload: { orderId: string; amount: number; userId: number }) {
    console.log('Received order success event:', payload);
    this.metricsService.trackBusinessSuccess('orders', 'order.success');
  }
}
