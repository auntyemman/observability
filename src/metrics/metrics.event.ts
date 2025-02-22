import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsEvent {
  constructor(private readonly metricsService: MetricsService) {
  }

  @OnEvent('userSignup.success', { async: true })
  handleUserSignupEvent(payload: any) {
    try {
      console.log('Received user signup event:', payload);
      this.metricsService.trackBusinessSuccess('users', 'userSignup');
    } catch (error) {
      console.log('signup error', error);
    }
  }

  @OnEvent('order.success', { async: true })
  handleOrderSuccessEvent(payload: any) {
    console.log('Received order success event:', payload);
    this.metricsService.trackBusinessSuccess('orders', 'order.success');
  }
}
