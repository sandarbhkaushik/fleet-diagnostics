import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { DiagnosticsStore } from '../../../core/store/diagnostics.store';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="filter-panel">
      <h3>Filters</h3>
      <div class="filter-grid">
        <div class="filter-field">
          <label for="vehicle">Vehicle ID</label>
          <input id="vehicle" [formControl]="form.controls.vehicle" placeholder="e.g. 1234" />
        </div>
        <div class="filter-field">
          <label for="code">Error Code</label>
          <input id="code" [formControl]="form.controls.code" placeholder="e.g. U0420" />
        </div>
        <div class="filter-field">
          <label for="level">Severity</label>
          <select id="level" [formControl]="form.controls.level">
            <option value="">All</option>
            <option value="ERROR">ERROR</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
          </select>
        </div>
        <div class="filter-field">
          <label for="from">From</label>
          <input id="from" type="date" [formControl]="form.controls.from" />
        </div>
        <div class="filter-field">
          <label for="to">To</label>
          <input id="to" type="date" [formControl]="form.controls.to" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-panel {
      background: white; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 1.25rem; margin-bottom: 1.5rem;
    }
    h3 { margin: 0 0 1rem; font-size: 1rem; color: #1e293b; }
    .filter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .filter-field { display: flex; flex-direction: column; gap: 0.25rem; }
    label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    input, select {
      padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;
      font-size: 0.875rem; outline: none;
      &:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
    }
  `],
})
export class FilterPanelComponent implements OnInit {
  private readonly store = inject(DiagnosticsStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    vehicle: '',
    code: '',
    level: '' as '' | 'INFO' | 'WARN' | 'ERROR',
    from: '',
    to: '',
  });

  ngOnInit() {
    this.form.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.store.updateFilters({
          vehicle: val.vehicle || undefined,
          code: val.code || undefined,
          level: val.level || '',
          from: val.from ? new Date(val.from).toISOString() : undefined,
          to: val.to ? new Date(val.to + 'T23:59:59').toISOString() : undefined,
        });
      });
  }
}
