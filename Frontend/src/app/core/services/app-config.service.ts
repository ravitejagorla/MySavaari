import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  readonly title = signal('RA's Raids');
  setTitle(title: string): void {
    this.title.set(title);
  }
}