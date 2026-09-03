import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
      <button type="button" (click)="toggleTheme()" aria-label="Toggle theme"
        class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
        @if (theme$ | async; as theme) {
            @if (theme === 'dark') {
                <i class="pi pi-sun text-sm"></i>
            } @else {
                <i class="pi pi-moon text-sm"></i>
            }
        }
    </button>
  `
})
export class ThemeToggle {

  theme$;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}