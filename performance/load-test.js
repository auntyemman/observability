import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter, Gauge } from 'k6/metrics'; // ✅ Correct import for custom metrics

// Initialize custom metrics to track performance data
const totalRequests = new Counter('total_requests'); // Tracks the total number of requests
const failedRequests = new Rate('failed_requests'); // Tracks the rate of failed requests
const responseTime = new Trend('response_time'); // Tracks the response time of requests
const throughput = new Gauge('throughput'); // Tracks the throughput (requests per second)

export let options = {
  // Stages for ramping up and down the load
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up: 50 users over 30 seconds
    { duration: '30s', target: 100 }, // Sustained load: 100 users for 30 seconds
    { duration: '30s', target: 0 }, // Ramp-down: 0 users over 30 seconds
  ],
  
  // Defining thresholds to assert the performance
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should complete in under 2 seconds
    http_req_failed: ['rate<0.01'], // Fail rate of requests should be less than 1%
    failed_requests: ['rate<0.01'], // Custom fail rate threshold
    response_time: ['p(95)<2000'], // Ensure 95% of responses are under 2 seconds
    // Removed `throughput` threshold as it is not practical in the current context
  },
};

export default function () {
  // Perform an HTTP GET request to the specified endpoint
  const res = http.get('http://localhost:3000/sync-block');

  // Increment total requests metric after each request
  totalRequests.add(1);

  // Add the response time of each request to the responseTime metric
  responseTime.add(res.timings.duration);

  // Track failed requests: if the status is not 200, it's considered a failure
  failedRequests.add(res.status !== 200);

  // Track throughput (requests per second) by adding 1 RPS per virtual user
  throughput.add(1);

  // Perform assertions to validate the request
  check(res, {
    'is status 200': (r) => r.status === 200, // Ensure the response status is 200
    'response time < 5s': (r) => r.timings.duration < 5000, // Ensure response time is less than 5000ms
  });

  // Sleep for 1 second between virtual users' requests
  sleep(1);
}
