import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly storageKey = 'theme';

  private themeSubject = new BehaviorSubject<Theme>('light');

  theme$ = this.themeSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {

      const savedTheme =
        localStorage.getItem(this.storageKey) as Theme | null;

      const theme: Theme =
        savedTheme === 'dark' ? 'dark' : 'light';

      this.setTheme(theme);

    } else {

      this.setTheme('light');

    }
  }


  toggleTheme(): void {

    const newTheme: Theme =
      this.themeSubject.value === 'light'
        ? 'dark'
        : 'light';

    this.setTheme(newTheme);
  }


  setTheme(theme: Theme): void {

    this.themeSubject.next(theme);


    // Apply Tailwind dark mode
    if (this.isBrowser) {

      if (theme === 'dark') {

        document.documentElement.classList.add('dark');

      } else {

        document.documentElement.classList.remove('dark');

      }


      // Remember user's preference
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