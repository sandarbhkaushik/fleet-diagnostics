import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Summary, ErrorsPerVehicle, TopCode, CriticalVehicle } from '../models/aggregation.model';

@Injectable({ providedIn: 'root' })
export class AggregationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/aggregations';

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.baseUrl}/summary`);
  }

  getErrorsPerVehicle(): Observable<ErrorsPerVehicle[]> {
    return this.http.get<ErrorsPerVehicle[]>(`${this.baseUrl}/errors-per-vehicle`);
  }

  getTopCodes(limit = 10): Observable<TopCode[]> {
    return this.http.get<TopCode[]>(`${this.baseUrl}/top-codes?limit=${limit}`);
  }

  getCriticalVehicles(): Observable<CriticalVehicle[]> {
    return this.http.get<CriticalVehicle[]>(`${this.baseUrl}/critical-vehicles`);
  }
}
