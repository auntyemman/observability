import { Injectable } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import {
  register,
  collectDefaultMetrics,
  Counter,
  Histogram,
  Gauge,
} from 'prom-client';

@Injectable()
export class MetricsService {
  // Define your custom metrics
  private readonly httpRequestDurationMicroseconds: Histogram<string>;
  private readonly httpRequestCount: Counter<string>;
  private readonly httpRequestErrors: Counter<string>;
  private readonly responseSize: Histogram<string>;
  private readonly cpuUsage: Gauge<string>;
  private readonly memoryUsage: Gauge<string>;
  private readonly dbQueryDuration: Histogram<string>;
  private readonly dbQueryCount: Counter<string>;
  private readonly queueSize: Gauge<string>;
  private readonly businessSuccessCount: Counter<string>;
  private readonly businessFailureCount: Counter<string>;
  private readonly businessProcessingDuration: Histogram<string>;

  constructor() {
    // Collect default metrics for Prometheus like memory usage, CPU usage, etc.
    collectDefaultMetrics();

    // Create a histogram for request duration
    this.httpRequestDurationMicroseconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Histogram of HTTP request durations in seconds.',
      buckets: [0.1, 0.3, 1.5, 5, 10], // define your buckets
    });

    this.httpRequestCount = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests received.',
      labelNames: ['method', 'status'],
    });

    this.httpRequestErrors = new Counter({
      name: 'http_requests_errors_total',
      help: 'Total number of HTTP requests that resulted in error.',
      labelNames: ['method', 'status'],
    });

    // Response Size
    this.responseSize = new Histogram({
      name: 'http_response_size_bytes_total',
      help: 'Total size of HTTP responses in bytes.',
    });

    // System Metrics (CPU and Memory Usage)
    this.cpuUsage = new Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage.',
    });

    this.memoryUsage = new Gauge({
      name: 'memory_usage_bytes',
      help: 'Memory usage in bytes.',
    });

    // Database Metrics
    this.dbQueryCount = new Counter({
      name: 'database_queries_total',
      help: 'Total number of database queries executed.',
    });

    this.dbQueryDuration = new Histogram({
      name: 'database_query_duration_seconds',
      help: 'Database query duration in seconds.',
      buckets: [0.1, 0.3, 1, 5, 10],
    });

    // Queue Metrics
    this.queueSize = new Gauge({
      name: 'queue_size_total',
      help: 'Number of jobs in the queue.',
    });

    this.businessSuccessCount = new Counter({
      name: 'business_success_total',
      help: 'Total number of successful business operations',
      labelNames: ['service', 'operation'],
    });

    this.businessFailureCount = new Counter({
      name: 'business_failures_total',
      help: 'Total number of failed business operations',
      labelNames: ['service', 'operation'],
    });

    this.businessProcessingDuration = new Histogram({
      name: 'business_processing_duration_seconds',
      help: 'Duration of business processing operations in seconds',
      labelNames: ['service', 'operation'],
      buckets: [0.1, 0.5, 1, 5, 10, 30],
    });
  }

  onModuleInit() {
    setInterval(() => {
      this.memoryUsage.set(process.memoryUsage().heapUsed);
      this.cpuUsage.set(process.cpuUsage().system / 1e6); // Convert from microseconds to milliseconds
    }, 5000); // Update every 5 seconds

  }

  // Expose metrics via an endpoint
  async getMetrics() {
    return register.metrics(); // Expose the collected metrics
  }

  // Track HTTP Request Duration and Errors
  trackHttpRequest(
    method: string,
    status: number,
    duration: number,
    size: number,
  ) {
    this.httpRequestDurationMicroseconds.observe(duration / 1000);
    this.httpRequestCount.inc({ method, status });
    if (status >= 400) {
      this.httpRequestErrors.inc({ method, status });
    }
    this.responseSize.observe(size);
  }

  // Track System Metrics (e.g., CPU usage)
  trackSystemMetrics(cpuPercent: number, memoryBytes: number) {
    this.cpuUsage.set(cpuPercent);
    this.memoryUsage.set(memoryBytes);
  }

  // Track Database Query Metrics
  trackDatabaseQuery(duration: number, queries: number) {
    this.dbQueryDuration.observe(duration / 1000);
    this.dbQueryCount.inc(queries);
  }

  // Track Queue Metrics
  trackQueueSize(size: number) {
    this.queueSize.set(size);
  }

  // Track Business Metrics (e.g., successful and failed payment operations)
  trackBusinessSuccess(service: string, operation: string) {
    this.businessSuccessCount.inc({ service, operation });
  }

  trackBusinessFailure(service: string, operation: string) {
    this.businessFailureCount.inc({ service, operation });
  }

  trackBusinessProcessingDuration(
    service: string,
    operation: string,
    duration: number,
  ) {
    this.businessProcessingDuration.observe(
      { service, operation },
      duration / 1000,
    );
  }
}
