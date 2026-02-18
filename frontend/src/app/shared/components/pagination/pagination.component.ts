import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination">
      <button [disabled]="currentPage() <= 1" (click)="pageChange.emit(currentPage() - 1)">Previous</button>
      <span class="page-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
      <button [disabled]="currentPage() >= totalPages()" (click)="pageChange.emit(currentPage() + 1)">Next</button>
    </div>
  `,
  styles: [`
    .pagination { display: flex; align-items: center; gap: 1rem; justify-content: center; padding: 1rem 0; }
    button {
      padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 6px;
      background: white; cursor: pointer; font-size: 0.875rem;
      &:hover:not(:disabled) { background: #f3f4f6; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .page-info { font-size: 0.875rem; color: #6b7280; }
  `],
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();
}
