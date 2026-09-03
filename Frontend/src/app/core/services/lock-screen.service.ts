import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root', })
export class LockScreenService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly lockStateKey = 'app_locked';
  private readonly pinKey = 'app_lock_pin';

  readonly isLocked = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isLocked.set(sessionStorage.getItem(this.lockStateKey) === 'true',);
  }

  lock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    sessionStorage.setItem(this.lockStateKey, 'true');
    this.isLocked.set(true);
  }

  unlock(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    sessionStorage.removeItem(this.lockStateKey);
    this.isLocked.set(false);
  }
  hasPin(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return !!localStorage.getItem(this.pinKey);
  }

  async setPin(pin: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      throw new Error('PIN must contain exactly 6 digits.');
    }

    const hash = await this.hashPin(pin);

    localStorage.setItem(this.pinKey, hash);
  }

  async verifyPin(pin: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const storedHash = localStorage.getItem(this.pinKey);

    if (!storedHash) {
      return false;
    }

    const enteredHash = await this.hashPin(pin);

    return enteredHash === storedHash;
  }

  clearPin(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.pinKey);
  }

  private async hashPin(pin: string): Promise<string> {
    const data = new TextEncoder().encode(pin);

    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      data,
    );

    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
