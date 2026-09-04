import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
export interface CurrentUser {
  id: string;
  profile_picture: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  role: string;
  email: string | null;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
}

@Injectable({ providedIn: 'root', })
export class UserService {
  private readonly apiService = inject(ApiService);
  readonly user = signal<CurrentUser | null>(null);

  loadCurrentUser() {
    return this.apiService.get('accounts/me/');
  }

  setUser(user: CurrentUser): void {
    this.user.set(user);
  }

  clearUser(): void {
    this.user.set(null);
  }

  getUser(): CurrentUser | null {
    return this.user();
  }
}