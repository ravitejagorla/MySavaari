import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle-button.component.html'
})
export class ThemeToggleButtonComponent {

  theme$;

  constructor(
    private themeService: ThemeService
  ) {
    this.theme$ = this.themeService.theme$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}