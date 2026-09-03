import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  readonly title = signal('MySavaari');
  setTitle(title: string): void {
    this.title.set(title);
  }
}