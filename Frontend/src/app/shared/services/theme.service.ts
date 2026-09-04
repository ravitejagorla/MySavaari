import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root',})
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeSubject = new BehaviorSubject<Theme>('light');
  readonly theme$ = this.themeSubject.asObservable();
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem(this.storageKey);
      const theme: Theme =savedTheme === 'dark' ? 'dark' : 'light';
      this.themeSubject.next(theme);
    }
  }

  toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    if (this.isBrowser) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(this.storageKey, theme);
    }
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  isDark(): boolean {
    return this.themeSubject.value === 'dark';
  }
}