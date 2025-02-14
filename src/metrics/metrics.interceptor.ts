import { Injectable } from '@nestjs/common';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MetricsService } from './metrics.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const method = context.switchToHttp().getRequest().method;
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const statusCode = response.statusCode;
        const size = Buffer.byteLength(response.body);
        this.metricsService.trackHttpRequest(
          method,
          statusCode,
          duration,
          size,
        );
      }),
    );
  }
}
