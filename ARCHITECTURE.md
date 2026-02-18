# Architecture

## Backend (NestJS + TypeORM + SQLite)

### Data Flow
```
Log File / POST → LogParserService (regex) → DiagnosticEvent entity → SQLite
                                                                         ↓
Client ← JSON ← Controller ← Service ← TypeORM QueryBuilder ← SQLite
```

### Layers
- **Entity**: `DiagnosticEvent` — indexed on timestamp, vehicleId, level, code for fast filtering
- **Parser**: `LogParserService` — regex-based parser matching the PDF format: `[timestamp] [VEHICLE_ID:xxx] [LEVEL] [CODE:xxx] [message]`
- **Services**: `DiagnosticsService` (filtered queries + log ingestion), `AggregationService` (summary, errors-per-vehicle, top-codes, critical vehicles — all with optional time range)
- **Controllers**: RESTful endpoints with class-validator DTOs and Swagger decorators

### Key Decisions
- **TypeORM QueryBuilder** for dynamic filter composition — cleanly chains `.andWhere()` for any combination of vehicle, code, level, time range
- **better-sqlite3** driver for zero-config embedded database — no external DB needed
- **Global ValidationPipe** with `transform: true` for automatic DTO transformation and input validation
- **"Critical" definition**: Vehicle with 3+ ERROR events in the last 24 hours
- **Ingestion endpoint**: `POST /api/events/ingest` accepts plain-text log lines for flexible data loading

## Frontend (Angular 17+ Standalone)

### State Management Approach: Signals + RxJS Bridge

I chose **Signals with RxJS** (not NgRx) to demonstrate deep understanding of both reactive paradigms and how they complement each other.

The `DiagnosticsStore` is the architectural centerpiece:

```
UI (Reactive Form) → signal(filters) → toObservable() → debounceTime(300)
                                                              ↓
                                                         switchMap(api.getEvents)
                                                              ↓
Template ← signal(result) ← toSignal() ← shareReplay(1) ← response
```

### Why Signals + RxJS (not NgRx)?

- **Signals** handle synchronous UI state (filters, loading, error flags) — lightweight, no boilerplate, no subscription management needed
- **RxJS** handles async orchestration — where its operators truly shine:
  - `debounceTime(300)` — prevents rapid-fire API calls as user types
  - `switchMap` — cancels in-flight requests when filters change (handles stale data)
  - `combineLatest` — loads dashboard data (summary, top codes, critical vehicles) in parallel
  - `shareReplay({ bufferSize: 1, refCount: true })` — caches latest result for late subscribers
  - `interval` + `takeUntil` — drives polling-based live updates
- **toObservable / toSignal** bridge connects both worlds cleanly without manual subscriptions

### Live Updates
- 30-second polling interval refreshes both event list and dashboard data
- Toggleable via checkbox in the UI
- `switchMap` ensures only one request is in-flight at a time

### Main Building Blocks

| Block | Purpose |
|-------|---------|
| `DiagnosticsStore` | Central state — signals for UI, RxJS for async |
| `DiagnosticsApiService` | HTTP calls for events (GET, POST ingest) |
| `AggregationApiService` | HTTP calls for aggregation endpoints |
| `FilterPanelComponent` | Reactive form → store filter updates |
| `EventTableComponent` | Paginated table consuming store signals |
| `DashboardComponent` | Summary cards + top codes + critical vehicles |

### Component Architecture
- **Standalone components** throughout (no NgModules)
- **Lazy-loaded routes** for dashboard and event explorer
- **Smart/Dumb split**: page containers inject store; child components receive data

## Data Flow Diagram

```
┌─────────────┐     HTTP      ┌──────────────┐     TypeORM     ┌────────┐
│   Angular    │ ←──────────→ │   NestJS     │ ←─────────────→ │ SQLite │
│  Dashboard   │   REST API   │   Backend    │   QueryBuilder  │   DB   │
└─────────────┘               └──────────────┘                 └────────┘
      ↑                              ↑
   Signals +                   Swagger docs
   RxJS Store                 at /api/docs
   (live polling)
```
