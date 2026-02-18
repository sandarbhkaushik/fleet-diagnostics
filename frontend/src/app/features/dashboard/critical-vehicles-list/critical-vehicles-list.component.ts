import { Component, inject } from '@angular/core';
import { DiagnosticsStore } from '../../../core/store/diagnostics.store';

@Component({
  selector: 'app-critical-vehicles-list',
  standalone: true,
  template: `
    <div class="panel">
      <h3>Critical Vehicles <span class="subtitle">(3+ errors in 24h)</span></h3>
      <div class="vehicle-list">
        @for (v of store.criticalVehicles(); track v.vehicleId) {
          <div class="vehicle-row">
            <span class="vehicle-id">{{ v.vehicleId }}</span>
            <span class="error-count">{{ v.recentErrorCount }} errors</span>
          </div>
        } @empty {
          <div class="empty">No critical vehicles</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .panel { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; }
    h3 { margin: 0 0 1rem; font-size: 1rem; color: #1e293b; }
    .subtitle { font-size: 0.75rem; color: #94a3b8; font-weight: 400; }
    .vehicle-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem;
      background: #fef2f2; border: 1px solid #fecaca;
    }
    .vehicle-id { font-family: monospace; font-weight: 700; color: #991b1b; }
    .error-count { font-size: 0.875rem; font-weight: 600; color: #dc2626; }
    .empty { text-align: center; color: #94a3b8; padding: 1rem; }
  `],
})
export class CriticalVehiclesListComponent {
  readonly store = inject(DiagnosticsStore);
}
