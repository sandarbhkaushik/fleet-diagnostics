# Business Requirements

## Overview
Build a Connected Fleet Health & Diagnostics Console that processes vehicle diagnostic logs, provides filtered event browsing, and displays fleet health aggregations.

## Functional Requirements

1. **Log Ingestion**: Parse structured diagnostic log lines in the format `[timestamp] vehicleId LEVEL CODE message`
2. **Event Storage**: Persist parsed events in SQLite with indexed fields for fast querying
3. **Event Browsing**: Filter events by vehicle ID, diagnostic code, severity level, and date range with pagination
4. **Fleet Summary**: Display total event counts by severity and number of critical vehicles
5. **Top Codes**: Show the most frequently occurring diagnostic codes
6. **Critical Vehicles**: Identify vehicles with 3 or more ERROR-level events in the last 24 hours

## Non-Functional Requirements

- Responsive UI that works on desktop and tablet
- Debounced filter inputs to avoid excessive API calls
- Automatic cancellation of stale requests via RxJS switchMap
- Clean REST API with Swagger documentation

## Assumptions

- No authentication/authorization required
- Data is seeded via a script (no file upload UI)
- SQLite is sufficient (no need for a production database)
- "Critical" threshold is 3+ ERROR events in 24 hours
- Timestamps are in UTC
