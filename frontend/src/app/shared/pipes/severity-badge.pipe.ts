import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'severityBadge', standalone: true })
export class SeverityBadgePipe implements PipeTransform {
  transform(level: string): string {
    switch (level) {
      case 'ERROR': return 'badge badge-error';
      case 'WARN': return 'badge badge-warn';
      case 'INFO': return 'badge badge-info';
      default: return 'badge';
    }
  }
}
