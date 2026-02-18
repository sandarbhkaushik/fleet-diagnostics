import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DiagnosticsStore } from '../../../core/store/diagnostics.store';
import { SeverityBadgePipe } from '../../../shared/pipes/severity-badge.pipe';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-event-table',
  standalone: true,
  imports: [DatePipe, SeverityBadgePipe, PaginationComponent],
  template: `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Vehicle</th>
            <th>Severity</th>
            <th>Code</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          @for (event of store.events(); track event.id) {
            <tr>
              <td class="nowrap">{{ event.timestamp | date:'short' }}</td>
              <td><span class="vehicle-id">{{ event.vehicleId }}</span></td>
              <td><span [class]="event.level | severityBadge">{{ event.level }}</span></td>
              <td><code>{{ event.code }}</code></td>
              <td>{{ event.message }}</td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="empty">No events found</td></tr>
          }
        </tbody>
      </table>
    </div>
    @if (store.totalPages() > 1) {
      <app-pagination
        [currentPage]="store.currentPage()"
        [totalPages]="store.totalPages()"
        (pageChange)="store.setPage($event)"
      />
    }
    <div class="total-count">{{ store.totalEvents() }} total events</div>
  `,
  styles: [`
    .table-wrapper { overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    thead { background: #f8fafc; }
    th { text-align: left; padding: 0.75rem 1rem; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; }
    tr:hover { background: #f8fafc; }
    .nowrap { white-space: nowrap; }
    .vehicle-id { font-family: monospace; font-weight: 600; }
    code { background: #f1f5f9; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.8rem; }
    .empty { text-align: center; color: #94a3b8; padding: 2rem !important; }
    .total-count { text-align: center; font-size: 0.8rem; color: #94a3b8; padding: 0.5rem; }
  `],
})
export class EventTableComponent {
  readonly store = inject(DiagnosticsStore);
}
