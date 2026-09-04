import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({providedIn: 'root'})
export class IdleService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly idleTimeout = 1 * 60 * 1000;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private onIdle: (() => void) | null = null;
  private readonly activityEvents = [ 'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
  private readonly resetHandler = () => {this.reset();};
  start(onIdle: () => void): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.onIdle = onIdle;
    this.activityEvents.forEach((event) => {
      window.addEventListener(event, this.resetHandler, {
        passive: true
      });
    });
    this.reset();
  }

  reset(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.onIdle) {
      return;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.onIdle?.();
    }, this.idleTimeout);
  }

  stop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.activityEvents.forEach((event) => {
      window.removeEventListener(event, this.resetHandler);
    });
    this.onIdle = null;
  }
}