import { Component, inject } from '@angular/core';
import { DiagnosticsStore } from '../../../core/store/diagnostics.store';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  template: `
    <div class="cards-grid">
      <div class="card">
        <span class="card-value">{{ store.summary().totalEvents }}</span>
        <span class="card-label">Total Events</span>
      </div>
      <div class="card card-error">
        <span class="card-value">{{ store.summary().errorCount }}</span>
        <span class="card-label">Errors</span>
      </div>
      <div class="card card-warn">
        <span class="card-value">{{ store.summary().warnCount }}</span>
        <span class="card-label">Warnings</span>
      </div>
      <div class="card card-info">
        <span class="card-value">{{ store.summary().infoCount }}</span>
        <span class="card-label">Info</span>
      </div>
      <div class="card card-critical">
        <span class="card-value">{{ store.summary().criticalVehicleCount }}</span>
        <span class="card-label">Critical Vehicles</span>
      </div>
    </div>
  `,
  styles: [`
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card {
      background: white; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 1.25rem; text-align: center; border-top: 3px solid #3b82f6;
    }
    .card-error { border-top-color: #ef4444; }
    .card-warn { border-top-color: #f59e0b; }
    .card-info { border-top-color: #3b82f6; }
    .card-critical { border-top-color: #7c3aed; }
    .card-value { display: block; font-size: 2rem; font-weight: 700; color: #0f172a; }
    .card-label { font-size: 0.8rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
  `],
})
export class SummaryCardsComponent {
  readonly store = inject(DiagnosticsStore);
}
