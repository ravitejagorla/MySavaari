import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LockScreenService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiService = inject(ApiService);
  private readonly lockStateKey = 'app_locked';
  readonly isLocked = signal(false);
  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isLocked.set(
      sessionStorage.getItem(this.lockStateKey) === 'true'
    );
  }

  lock(): Observable<any> {
    return this.apiService.post('accounts/lock_screen/', {}).pipe(
      tap((response) => {
        if (response?.status === 'success' && isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem(this.lockStateKey, 'true');
          this.isLocked.set(true);
        }
      })
    );
  }

  unlock(pin: string): Observable<any> {
    return this.apiService.post('accounts/unlock_screen/', { pin }).pipe(
      tap((response) => {
        if (response?.status === 'success' && isPlatformBrowser(this.platformId)) {
          sessionStorage.removeItem(this.lockStateKey);
          this.isLocked.set(false);
        }
      })
    );
  }
}