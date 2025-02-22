import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionsFilter } from './common/filters/exceptions-handler.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MetricsEvent } from './metrics/metrics.event';

@Module({
  imports: [UsersModule, MetricsModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    MetricsEvent,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {}
