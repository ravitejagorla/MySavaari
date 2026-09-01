import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { GlobalToastService } from '../../../../core/services/global-toast.service';
import { Router, RouterLink } from '@angular/router';
import { Destroyer } from '../../../../reusable/destroyer/destroyer';
import { ButtonModule } from 'primeng/button';
import { InputFieldComponent } from '../../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../../shared/components/form/label/label.component';

@Component({
  imports: [ButtonModule, LabelComponent, InputFieldComponent, FormsModule, ReactiveFormsModule, RouterLink],
  selector: 'ras-sms-otp',
  styleUrl: './sms-otp.css',
  templateUrl: './sms-otp.html',
})
export class SmsOtp extends Destroyer implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private userId: string | null = null;
  isLoading = true;
  mobileOtpForm!: FormGroup;
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
    this.mobileOtpForm = this.fb.group({
      user_id: [this.userId],
      otp: ['', [
        Validators.required,
      ]],
      otp_type: ['PHONE']
    });
  }

  onFormSubmit(): void {
    if (this.mobileOtpForm.invalid) {
      this.mobileOtpForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.apiService
      .post('accounts/otp_verification/', this.mobileOtpForm.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toast.fromResponse(response);
          if (response.status === 'success') {
            const data = response.data;
            this.router.navigate(['/auth/login']);
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
        otp_type: 'PHONE'
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
    return this.mobileOtpForm.get(name);
  }
}
