import { Component, OnInit, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Destroyer } from '../../../../reusable/destroyer/destroyer';
import { ApiService } from '../../../../core/services/api.service';
import { GlobalToastService } from '../../../../core/services/global-toast.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';

@Component({
  selector: 'ras-email-otp',
  imports: [ ButtonModule, LabelComponent, InputFieldComponent, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './email-otp.html',
  styleUrl: './email-otp.css',
})
export class EmailOtp extends Destroyer implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private userId: string | null = null;
  isLoading = true;
  emailOtpForm!: FormGroup;
  constructor(
    protected readonly appConfig: AppConfigService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly toast: GlobalToastService,
    private readonly fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = sessionStorage.getItem('user_id');
    }
    if (!this.userId) {
      this.toast.show(
        'error',
        'Registration',
        'Registration session expired. Please register again.'
      );
      this.router.navigate(['/auth/register']);
      return;
    }
    this.initForm();
    this.isLoading = false;
  }

  initForm(): void {
    this.emailOtpForm = this.fb.group({
      user_id: [this.userId],
      otp: ['', [
        Validators.required,
      ]],
      otp_type: ['EMAIL']
    });
  }

  onFormSubmit(): void {
    if (this.emailOtpForm.invalid) {
      this.emailOtpForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.apiService
      .post('accounts/otp_verification/', this.emailOtpForm.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toast.fromResponse(response);
          if (response.status === 'success') {
            const data = response.data;
            if (isPlatformBrowser(this.platformId)) {
              sessionStorage.setItem('user_id', data.user_id);
            }
            this.router.navigate(['/auth/phone-verify']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('OTP verification failed:', error);
          this.toast.show(
            'error',
            'Error',
            'OTP verification failed. Please try again.'
          );
        }
      });
  }

  resendOtp(): void {
    if (!this.userId) {
      return;
    }
    this.apiService
      .post('accounts/resend_otp/', {
        user_id: this.userId,
        otp_type: 'EMAIL'
      })
      .subscribe({
        next: (response) => {
          this.toast.fromResponse(response);
        },
        error: (error) => {
          console.error('OTP resend failed:', error);
          this.toast.show(
            'error',
            'Error',
            'Resend failed. Please try again.'
          );
        }
      });
  }

  getControl(name: string): AbstractControl | null {
    return this.emailOtpForm.get(name);
  }
}