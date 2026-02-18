import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiagnosticEvent, EventFilter, PaginatedEvents } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class DiagnosticsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/events';

  getEvents(filter: EventFilter): Observable<PaginatedEvents> {
    let params = new HttpParams()
      .set('page', filter.page.toString())
      .set('limit', filter.limit.toString());

    if (filter.vehicle) params = params.set('vehicle', filter.vehicle);
    if (filter.code) params = params.set('code', filter.code);
    if (filter.level) params = params.set('level', filter.level);
    if (filter.from) params = params.set('from', filter.from);
    if (filter.to) params = params.set('to', filter.to);

    return this.http.get<PaginatedEvents>(this.baseUrl, { params });
  }

  getEvent(id: number): Observable<DiagnosticEvent> {
    return this.http.get<DiagnosticEvent>(`${this.baseUrl}/${id}`);
  }
}
