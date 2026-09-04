import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { GlobalToastService } from '../../../../core/services/global-toast.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dropdown.html',
  styleUrl: './user-dropdown.css',
})
export class UserDropdown {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(GlobalToastService);
  readonly user = this.userService.user;

  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.close();
    this.userService.clearUser();
    this.authService.logout();
    this.toast.show('success', 'Logout', 'Logged out successfully',);
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'Admin';

      case 'BRANCH_ADMIN':
        return 'Branch Admin';

      case 'EMPLOYEE':
        return 'Employee';

      case 'CUSTOMER':
        return 'Customer';

      default:
        return role;
    }
  }
}