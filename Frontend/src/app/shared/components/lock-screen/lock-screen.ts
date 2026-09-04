import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LockScreenService } from '../../../core/services/lock-screen.service';

@Component({
  selector: 'lock-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lock-screen.html',
  styleUrl: './lock-screen.css'
})
export class LockScreen {
  protected readonly lockScreenService = inject(LockScreenService);

  pin = '';
  isLoading = false;
  errorMessage = '';

  onPinInput(): void {
    this.pin = this.pin.replace(/\D/g, '').slice(0, 6);
    this.errorMessage = '';
  }

  unlock(): void {
    if (this.pin.length !== 6) {
      this.errorMessage = 'Enter your 6-digit PIN.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.lockScreenService.unlock(this.pin).subscribe({
      next: (response) => {
        if (response?.status === 'success') {
          this.pin = '';
        } else {
          this.errorMessage =
            response?.message || 'Unable to unlock the application.';
        }

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to unlock the application.';
        this.isLoading = false;
      }
    });
  }
}