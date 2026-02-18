# Fleet Health & Diagnostics Console

A fullstack vehicle fleet diagnostics console that ingests structured diagnostic logs, stores them in SQLite, exposes a REST API with filtering/aggregation, and provides an Angular dashboard with Signals + RxJS state management.

## Prerequisites

- Node.js 20+
- npm 9+

## Quick Start

### Backend

```bash
cd backend
npm install
npm run seed        # Seeds ~500 diagnostic events
npm run start:dev   # Starts on http://localhost:3000
```

Swagger UI: http://localhost:3000/api/docs

### Frontend

```bash
cd frontend
npm install
npx ng serve        # Starts on http://localhost:4200
```

### Docker

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
