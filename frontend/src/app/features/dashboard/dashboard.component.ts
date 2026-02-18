import { Component, inject } from '@angular/core';
import { DiagnosticsStore } from '../../core/store/diagnostics.store';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';
import { SummaryCardsComponent } from './summary-cards/summary-cards.component';
import { TopCodesListComponent } from './top-codes-list/top-codes-list.component';
import { CriticalVehiclesListComponent } from './critical-vehicles-list/critical-vehicles-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    LoadingSpinnerComponent, ErrorAlertComponent,
    SummaryCardsComponent, TopCodesListComponent, CriticalVehiclesListComponent,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h2>Fleet Dashboard</h2>
        <div class="header-actions">
          <label class="live-toggle">
            <input type="checkbox" [checked]="store.liveUpdatesEnabled()" (change)="store.toggleLiveUpdates()" />
            Live updates
          </label>
          <button class="refresh-btn" (click)="store.refreshDashboard()">Refresh</button>
        </div>
      </div>
      <app-error-alert [message]="store.dashboardError()" />
      @if (store.dashboardLoading()) {
        <app-loading-spinner />
      } @else {
        <app-summary-cards />
        <div class="dashboard-grid">
          <app-top-codes-list />
          <app-critical-vehicles-list />
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { margin: 0; color: #0f172a; font-size: 1.5rem; }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .live-toggle {
      display: flex; align-items: center; gap: 0.4rem;
      font-size: 0.85rem; color: #64748b; cursor: pointer;
      input { cursor: pointer; }
    }
    .refresh-btn {
      padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none;
      border-radius: 6px; cursor: pointer; font-size: 0.875rem;
      &:hover { background: #2563eb; }
    }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    @media (max-width: 768px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class DashboardComponent {
  readonly store = inject(DiagnosticsStore);
}
