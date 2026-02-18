import { Component, inject } from '@angular/core';
import { DiagnosticsStore } from '../../../core/store/diagnostics.store';

@Component({
  selector: 'app-top-codes-list',
  standalone: true,
  template: `
    <div class="panel">
      <h3>Top Diagnostic Codes</h3>
      <div class="code-list">
        @for (item of store.topCodes(); track item.code) {
          <div class="code-row">
            <code>{{ item.code }}</code>
            <div class="bar-wrapper">
              <div class="bar" [style.width.%]="barWidth(item.count)"></div>
            </div>
            <span class="count">{{ item.count }}</span>
          </div>
        } @empty {
          <div class="empty">No codes found</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .panel { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; }
    h3 { margin: 0 0 1rem; font-size: 1rem; color: #1e293b; }
    .code-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; }
    code { background: #f1f5f9; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.8rem; min-width: 100px; }
    .bar-wrapper { flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
    .bar { height: 100%; background: #3b82f6; border-radius: 4px; transition: width 0.3s; }
    .count { font-size: 0.875rem; font-weight: 600; color: #475569; min-width: 30px; text-align: right; }
    .empty { text-align: center; color: #94a3b8; padding: 1rem; }
  `],
})
export class TopCodesListComponent {
  readonly store = inject(DiagnosticsStore);

  barWidth(count: number): number {
    const max = this.store.topCodes()[0]?.count ?? 1;
    return (count / max) * 100;
  }
}
