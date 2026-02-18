import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  debounceTime, switchMap, catchError, tap, combineLatest, of,
  startWith, map, shareReplay, interval, Subject, takeUntil,
} from 'rxjs';
import { DiagnosticsApiService } from '../services/diagnostics-api.service';
import { AggregationApiService } from '../services/aggregation-api.service';
import { EventFilter, PaginatedEvents } from '../models/event.model';
import { Summary, TopCode, CriticalVehicle } from '../models/aggregation.model';

const DEFAULT_FILTER: EventFilter = {
  vehicle: '',
  code: '',
  level: '',
  from: '',
  to: '',
  page: 1,
  limit: 20,
};

const LIVE_UPDATE_INTERVAL = 30_000; // 30 seconds

@Injectable({ providedIn: 'root' })
export class DiagnosticsStore implements OnDestroy {
  private readonly api = inject(DiagnosticsApiService);
  private readonly aggApi = inject(AggregationApiService);
  private readonly destroy$ = new Subject<void>();

  // --- Writable signals (sync UI state) ---
  readonly filters = signal<EventFilter>({ ...DEFAULT_FILTER });
  readonly eventsLoading = signal(false);
  readonly eventsError = signal<string | null>(null);
  readonly dashboardLoading = signal(false);
  readonly dashboardError = signal<string | null>(null);
  readonly liveUpdatesEnabled = signal(true);

  // --- RxJS bridge: filters signal → debounced API call → result signal ---
  private readonly filters$ = toObservable(this.filters);

  private readonly eventsResult$ = this.filters$.pipe(
    debounceTime(300),
    tap(() => {
      this.eventsLoading.set(true);
      this.eventsError.set(null);
    }),
    switchMap((f) =>
      this.api.getEvents(f).pipe(
        catchError((err) => {
          this.eventsError.set(err?.message ?? 'Failed to load events');
          return of<PaginatedEvents>({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
        }),
      ),
    ),
    tap(() => this.eventsLoading.set(false)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // Expose results back as signals for templates
  readonly eventsResult = toSignal(this.eventsResult$, {
    initialValue: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 } as PaginatedEvents,
  });

  readonly events = computed(() => this.eventsResult().data);
  readonly totalEvents = computed(() => this.eventsResult().total);
  readonly totalPages = computed(() => this.eventsResult().totalPages);
  readonly currentPage = computed(() => this.eventsResult().page);

  // --- Dashboard: parallel loading with combineLatest ---
  readonly dashboardTrigger = signal(0);

  private readonly dashboardResult$ = toObservable(this.dashboardTrigger).pipe(
    startWith(0),
    tap(() => {
      this.dashboardLoading.set(true);
      this.dashboardError.set(null);
    }),
    switchMap(() =>
      combineLatest([
        this.aggApi.getSummary(),
        this.aggApi.getTopCodes(10),
        this.aggApi.getCriticalVehicles(),
      ]).pipe(
        map(([summary, topCodes, criticalVehicles]) => ({ summary, topCodes, criticalVehicles })),
        catchError((err) => {
          this.dashboardError.set(err?.message ?? 'Failed to load dashboard');
          return of({
            summary: { totalEvents: 0, errorCount: 0, warnCount: 0, infoCount: 0, criticalVehicleCount: 0 } as Summary,
            topCodes: [] as TopCode[],
            criticalVehicles: [] as CriticalVehicle[],
          });
        }),
      ),
    ),
    tap(() => this.dashboardLoading.set(false)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly dashboardResult = toSignal(this.dashboardResult$, {
    initialValue: {
      summary: { totalEvents: 0, errorCount: 0, warnCount: 0, infoCount: 0, criticalVehicleCount: 0 },
      topCodes: [],
      criticalVehicles: [],
    },
  });

  readonly summary = computed(() => this.dashboardResult().summary);
  readonly topCodes = computed(() => this.dashboardResult().topCodes);
  readonly criticalVehicles = computed(() => this.dashboardResult().criticalVehicles);

  // --- Live updates: periodic polling ---
  private readonly liveUpdate$ = interval(LIVE_UPDATE_INTERVAL).pipe(
    takeUntil(this.destroy$),
  );

  constructor() {
    this.liveUpdate$.subscribe(() => {
      if (this.liveUpdatesEnabled()) {
        // Re-trigger events fetch by nudging filters (same values → new emission)
        this.filters.update((f) => ({ ...f }));
        this.dashboardTrigger.update((v) => v + 1);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Actions ---
  updateFilters(partial: Partial<EventFilter>) {
    this.filters.update((f) => ({ ...f, ...partial, page: partial.page ?? 1 }));
  }

  setPage(page: number) {
    this.filters.update((f) => ({ ...f, page }));
  }

  refreshDashboard() {
    this.dashboardTrigger.update((v) => v + 1);
  }

  toggleLiveUpdates() {
    this.liveUpdatesEnabled.update((v) => !v);
  }
}
