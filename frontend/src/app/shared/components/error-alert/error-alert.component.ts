import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    @if (message()) {
      <div class="error-alert">{{ message() }}</div>
    }
  `,
  styles: [`
    .error-alert {
      background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b;
      padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem;
    }
  `],
})
export class ErrorAlertComponent {
  message = input<string | null>(null);
}
