# Fleet Health & Diagnostics Console

A fullstack vehicle fleet diagnostics console that ingests structured diagnostic logs, stores them in SQLite, exposes a REST API with filtering/aggregation, and provides an Angular dashboard with Signals + RxJS state management.

## Prerequisites

Only **Node.js** and **npm** are required. All other tools (Angular CLI, NestJS CLI, TypeORM, etc.) are project dependencies and install automatically via `npm install`.

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 20+ (developed with v24) | [nodejs.org](https://nodejs.org/) |
| **npm** | 9+ (comes with Node.js) | Included with Node.js |
| **Docker** *(optional)* | 20+ | [docker.com](https://www.docker.com/) — only needed if running via containers |

> No global installs needed. `@angular/cli` and `@nestjs/cli` run via `npx` from local `node_modules`.

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/sandarbhkaushik/fleet-diagnostics.git
cd fleet-diagnostics

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 2. Start Backend

```bash
cd backend
npm run seed        # Seeds ~500 diagnostic events into SQLite
npm run start:dev   # Starts on http://localhost:3000
```

- Swagger UI: http://localhost:3000/api/docs
- Test: `curl http://localhost:3000/api/events?vehicle=1000&level=ERROR`

### 3. Start Frontend (in a separate terminal)

```bash
cd frontend
npx ng serve        # Starts on http://localhost:4200
```

- Dashboard: http://localhost:4200/dashboard
- Event Explorer: http://localhost:4200/events

### Alternative: Docker

```bash
docker-compose up --build
```

- Backend: http://localhost:3000
- Frontend: http://localhost:4200

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/events?vehicle=1234&code=U0420&level=ERROR&from=...&to=...&page=1&limit=20` | Filtered, paginated events |
| `GET /api/events/:id` | Single event by ID |
| `POST /api/events/ingest` | Ingest raw log lines (text/plain body) |
| `GET /api/aggregations/summary?from=...&to=...` | Total/error/warn counts + critical vehicle count |
| `GET /api/aggregations/errors-per-vehicle?from=...&to=...` | Error counts grouped by vehicle |
| `GET /api/aggregations/top-codes?limit=10&from=...&to=...` | Most frequent diagnostic codes |
| `GET /api/aggregations/critical-vehicles` | Vehicles with 3+ errors in last 24h |

## What Works

- Full CRUD + filtered querying of diagnostic events
- Log line ingestion via POST endpoint (matching the PDF log format)
- Aggregation endpoints with optional time range filtering
- Angular dashboard with two views: Event Explorer (table + filters) and Dashboard (summary cards + top codes + critical vehicles)
- Signal + RxJS bridge store with `debounceTime`, `switchMap`, `combineLatest`, `shareReplay`
- Live polling updates every 30 seconds (toggleable)
- In-flight request cancellation when filters change rapidly (switchMap)
- Swagger/OpenAPI documentation
- Docker containerization

## What I Would Do Next With More Time

- **WebSocket/SSE** for true real-time push updates instead of polling
- **Unit and integration tests** for both backend services and Angular components
- **Search text field** for free-text searching across messages
- **Per-vehicle detail view** with event timeline
- **Per error code drill-down** view
- **Charts** (e.g., errors over time line chart, severity distribution pie chart)
- **Infinite scroll** as alternative to pagination
- **Authentication/authorization** with role-based access
- **Rate limiting** and **caching** on aggregation endpoints
- **CI/CD pipeline** with linting, testing, and deployment
