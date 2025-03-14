# 📊 Observability in My Application  

## Overview  

This repository showcases a complete **observability strategy** implemented in a **NestJS application** with PostgreSQL. The observability stack includes **application metrics, business metrics, HTTP and error metrics, infrastructure-level metrics, logging, tracing, monitoring, and alerting** using Prometheus, Grafana, and Alertmanager.  

---

## 🔥 Observability Strategy  

Observability is implemented across **three main layers**:

1. **Application Metrics** – Collected using Prometheus metrics and custom instrumentation.  
2. **Infrastructure Metrics** – Monitored via `node_exporter` and `postgres_exporter`.  
3. **Monitoring & Visualization** – Dashboards and alerts set up with Prometheus, Grafana, and Alertmanager.  

---

## 📌 Application-Level Observability  

### ✅ Default Metrics  
By default, the application exposes Prometheus metrics such as:  

- `process_cpu_seconds_total` – Tracks CPU usage of the app.  
- `process_resident_memory_bytes` – Monitors memory consumption.  
- `http_requests_total` – Counts total HTTP requests.  
- `http_request_duration_seconds` – Captures request latency distributions.  

These metrics are exposed at the `/metrics` endpoint.  

### 🎯 Business Metrics (Event-Driven Observability)  
Business-critical metrics are collected using an **event bus**:  

- **User Sign-ups** (`user_signup_total`)  
- **Transaction Success/Failure** (`transaction_success_total`, `transaction_failure_total`)  
- **Order Processing Time** (`order_processing_duration_seconds`)  

These metrics help track domain-specific events and performance.  

### 🌍 HTTP Metrics (Using an Interceptor)  
A global **NestJS interceptor** is used to log and track HTTP requests:  

- **Request counts** per route (`http_requests_total`).  
- **Request duration** (`http_request_duration_seconds`).  
- **Response status codes** (`http_response_status_code`).  

### 🚨 Error Metrics (Using a Custom Logger)  
A custom **NestJS logger** tracks error occurrences:  

- **Application Errors** (`application_errors_total`)  
- **Database Errors** (`database_errors_total`)  
- **Authentication Failures** (`auth_failures_total`)  

Errors are also logged and sent to **Loki** for further analysis.  

---

## 📡 Infrastructure-Level Observability  

### 📌 Host System Metrics (via `node_exporter`)  
Node Exporter provides **hardware and OS-level metrics**, including:  

- **CPU Usage** (`node_cpu_seconds_total`)  
- **Memory Utilization** (`node_memory_Active_bytes`)  
- **Disk Usage** (`node_filesystem_size_bytes`, `node_filesystem_free_bytes`)  
- **System Load** (`node_load1`, `node_load5`, `node_load15`)  
- **Network Traffic** (`node_network_receive_bytes_total`, `node_network_transmit_bytes_total`)  

### 🗄️ Database Metrics (via `postgres_exporter`)  
PostgreSQL-specific metrics include:  

- **Active Connections** (`pg_stat_activity_count`)  
- **Transaction Rate** (`pg_stat_database_xact_commit`)  
- **Cache Hit Ratio** (`pg_stat_database_blks_hit`)  
- **Slow Queries** (`pg_stat_statements_total_time`)  

---

## Sample PromQL Queries
### Application Metrics
- Request Count:
  ```
  sum(rate(http_requests_total[5m]))
  ```
- Response Time (95th percentile):
  ```
  histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
  ```

### PostgreSQL Metrics
- Active Connections:
  ```
  pg_stat_database_numbackends{datname="$DB_NAME"}
  ```
- Slow Queries:
  ```
  rate(pg_stat_statements_total_time[5m])
  ```

### Node Metrics
- CPU Usage:
  ```
  100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
  ```
- Disk Usage:
  ```
  node_filesystem_avail_bytes / node_filesystem_size_bytes * 100
  ```
# Sample CPU Gauge Panel
![alt text](cpu_gauge.png)

## Running the Stack
Start all services using Docker Compose:

```sh
docker-compose up -d --build
```

This will spin up the following services:
- `observability` (Application)
- `database` (PostgreSQL)
- `postgres_exporter`
- `node_exporter`
- `prometheus`
- `grafana`

## Grafana Dashboards
To access Grafana:
- Open `http://localhost:3001`
- Login with `admin/admin`
- Import the provided dashboard JSON files

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
