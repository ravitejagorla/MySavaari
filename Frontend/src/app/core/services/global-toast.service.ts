import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class GlobalToastService {
  constructor(private messageService: MessageService) {}

  /**
   * Targets the default <p-toast> (usually top-right).
   * Used for general confirmations (e.g., Record added/deleted).
   */
  show(
    severity: 'success' | 'info' | 'warn' | 'error',
    summary: string,
    detail: string,
    life: number = 5000
  ) {
    // No 'key' property means it targets the default <p-toast>
    this.messageService.add({ severity, summary, detail, life });
  }

  /**
   * Converts a backend response object into a standard toast message.
   * Targets the default <p-toast>.
   */
  fromResponse(
    response: { status?: string; subject?: string; message?: string },
    defaultSeverity: 'info' | 'success' | 'error' | 'warn' = 'info'
  ) {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'error'> = {
      success: 'success',
      info: 'info',
      warn: 'warn',
      warning: 'warn',
      error: 'error',
      failed: 'error',
    };

    const severity = severityMap[response.status?.toLowerCase() ?? 'info'] ?? defaultSeverity;
    const summary = response.subject ?? 'Notice';
    const detail = response.message ?? '';

    this.show(severity, summary, detail);
  }

  /**
   * Targets the dedicated alert toast (<p-toast key="alertToast">).
   * Used for critical notifications with a distinct position and a sound effect.
   */
  showAlert(
    summary: string,
    detail: string,
    severity: 'warn' | 'error' = 'error',
    life: number = 7000
  ) {
    // 1. Play Sound
    this.playSoundEffect();

    // 2. Add Toast Message (Targets the 'alertToast' key)
    this.messageService.add({
      key: 'alertToast', // CRITICAL: This links to the second <p-toast>
      severity: severity,
      summary: summary,
      detail: detail,
      life: life,
      // You might want alerts to stick longer
      sticky: severity === 'error' ? true : false 
    });
  }
  
  /**
   * Utility method to play a sound effect.
   * NOTE: Ensure 'assets/alert.mp3' exists in your project.
   */
  private playSoundEffect() {
    // You can use a dedicated path to an asset file (e.g., a short chime or bell sound)
    const audio = new Audio('assets/audio/notification.mp3');
    // Using .play() returns a Promise, .catch() handles errors if the browser blocks autoplay
    audio.play().catch(e => console.error("Could not play sound:", e));
  }

  /**
   * Clears ALL toasts.
   * To clear only the general toast: this.messageService.clear();
   * To clear only the alert toast: this.messageService.clear('alertToast');
   */
  clear(key?: string) {
    this.messageService.clear(key);
  }
}