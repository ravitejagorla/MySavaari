import { Injectable, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

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
  private readonly authService = inject(AuthService);
  readonly user = signal<CurrentUser | null>(null);

  loadCurrentUser() {
    return this.apiService.get('accounts/me/');
  }

  initializeUser(): Observable<unknown> {
    if (!this.authService.isLoggedIn()) {
      return of(null);
    }

    return this.loadCurrentUser().pipe(
      tap((response) => {
        if (response?.status === 'success') {
          this.setUser(response.data);
        }
      }),
      catchError((error) => {
        console.error('Failed to restore user:', error);
        this.clearUser();

        return of(null);
      }),
    );
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