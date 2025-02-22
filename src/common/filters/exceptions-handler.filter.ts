import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';
import { MetricsService } from '../../metrics/metrics.service';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    constructor(private readonly metricsService: MetricsService) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
      const exceptionResponse = exception.getResponse();

      // Extract message and details from the exception
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || message;
        errorDetails = responseObj.errors || null;
      }
    } else if (exception instanceof Error) {
      // Handle unknown runtime errors
      message = exception.message;
      errorDetails = exception.stack;

      // Track the error in the metrics service
      this.metricsService.trackHttpRequestError(
        request.method,
        statusCode.toString(),
        message,
      );

      // Log only 5xx errors and uncaught exceptions to file
      logger.error({
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        stack: errorDetails,
      });

    }
     // Track the error in the metrics service
    this.metricsService.trackHttpRequestError(
      request.method,
      statusCode.toString(),
      message,
    );

    // Send a standardized error response.
    response.status(statusCode).json({
      statusCode,
      message,
      error: process.env.NODE_ENV !== 'production' ? errorDetails : null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
