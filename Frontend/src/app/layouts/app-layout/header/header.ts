import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeToggle } from '../../../shared/components/common/theme-toggle/theme-toggle';
import { AuthService } from '../../../core/services/auth.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { MyComponent } from "../../../shared/components/common/Full-Screen/full-screen";
import { SidebarService } from '../../../shared/services/sidebar.service';
import { GlobalToastService } from '../../../core/services/global-toast.service';

@Component({
  selector: 'ras-header',
  standalone: true,
  imports: [ThemeToggle, MyComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  protected readonly sidebarService = inject(SidebarService);
  constructor(
    protected readonly appConfig: AppConfigService,
    private toast: GlobalToastService,
    
  ) {}

  isUserMenuOpen = false;

  toggleSidebar(): void {
    this.sidebarService.toggleExpanded();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();

    this.toast.show('success', 'Logout', 'Logged out successfully');
  }
}