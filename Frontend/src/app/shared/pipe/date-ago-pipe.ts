import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  standalone: true 
})
export class DateAgoPipe implements PipeTransform {
  transform(value: string | number | Date, args?: any): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: Record<string, number> = {
      'year': 31536000,
      'month': 2592000,
      'day': 86400,
      'hour': 3600,
      'minute': 60,
      'second': 1
    };

    for (const interval in intervals) {
      const count = Math.floor(seconds / intervals[interval]);
      if (count >= 1) {
        return count === 1 ?
          `${count} ${interval} ago` :
          `${count} ${interval}s ago`;
      }
    }
    return 'just now';
  }
}
