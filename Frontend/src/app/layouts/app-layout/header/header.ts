import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeToggle } from '../../../shared/components/common/theme-toggle/theme-toggle';
import { AppConfigService } from '../../../core/services/app-config.service';
import { MyComponent } from "../../../shared/components/common/Full-Screen/full-screen";
import { SidebarService } from '../../../shared/services/sidebar.service';
import { UserDropdown } from '../../../shared/components/common/user-dropdown/user-dropdown';

@Component({
  selector: 'ras-header',
  standalone: true,
  imports: [ThemeToggle, MyComponent, UserDropdown],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly router = inject(Router);
  protected readonly sidebarService = inject(SidebarService);
  protected readonly appConfig = inject(AppConfigService);

  toggleSidebar(): void {
    this.sidebarService.toggleExpanded();
  }
}