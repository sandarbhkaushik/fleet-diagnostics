import { Component, inject } from '@angular/core';
import { DiagnosticsStore } from '../../core/store/diagnostics.store';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { EventTableComponent } from './event-table/event-table.component';

@Component({
  selector: 'app-event-explorer',
  standalone: true,
  imports: [LoadingSpinnerComponent, ErrorAlertComponent, FilterPanelComponent, EventTableComponent],
  template: `
    <div class="page">
      <h2>Event Explorer</h2>
      <app-filter-panel />
      <app-error-alert [message]="store.eventsError()" />
      @if (store.eventsLoading()) {
        <app-loading-spinner />
      } @else {
        <app-event-table />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
    h2 { margin: 0 0 1.5rem; color: #0f172a; font-size: 1.5rem; }
  `],
})
export class EventExplorerComponent {
  readonly store = inject(DiagnosticsStore);
}
