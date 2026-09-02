import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../../shared/components/common/theme-toggle/theme-toggle-button.component';
import { AuthService } from '../../../core/services/auth.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { MyComponent } from "../../../shared/components/common/Full-Screen/full-screen";

@Component({
  selector: 'ras-header',
  standalone: true,
  imports: [ThemeToggleButtonComponent, MyComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  constructor(protected readonly appConfig: AppConfigService,){}

  isUserMenuOpen = false;

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }
}