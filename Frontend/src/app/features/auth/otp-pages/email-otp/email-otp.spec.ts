import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { EmailOtp } from './email-otp';
import { ApiService } from '../../../../core/services/api.service';
import { GlobalToastService } from '../../../../core/services/global-toast.service';
import { AppConfigService } from '../../../../core/services/app-config.service';

describe('EmailOtp', () => {
  let component: EmailOtp;
  let fixture: ComponentFixture<EmailOtp>;

  let apiService: {
    post: ReturnType<typeof vi.fn>;
  };

  let toastService: {
    show: ReturnType<typeof vi.fn>;
    fromResponse: ReturnType<typeof vi.fn>;
  };

  let router: Router;

  beforeEach(async () => {
    apiService = {
      post: vi.fn(),
    };

    toastService = {
      show: vi.fn(),
      fromResponse: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EmailOtp],
      providers: [
        provideRouter([]),

        {
          provide: ApiService,
          useValue: apiService,
        },

        {
          provide: GlobalToastService,
          useValue: toastService,
        },

        {
          provide: AppConfigService,
          useValue: {
            title: vi.fn(() => 'MySavaari'),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    sessionStorage.clear();

    fixture = TestBed.createComponent(EmailOtp);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------
  // Creation
  // ---------------------------------------------------------

  it('should create', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // ---------------------------------------------------------
  // ngOnInit
  // ---------------------------------------------------------

  it('should load user_id from sessionStorage', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    expect(
      component.getControl('user_id')?.value
    ).toBe('test-user-id');
  });

  it('should initialize the OTP form', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    expect(component.emailOtpForm).toBeTruthy();

    expect(
      component.getControl('user_id')?.value
    ).toBe('test-user-id');

    expect(
      component.getControl('otp_type')?.value
    ).toBe('EMAIL');

    expect(component.isLoading).toBe(false);
  });

  it('should redirect to register when user_id is missing', () => {
    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    fixture.detectChanges();

    expect(toastService.show).toHaveBeenCalledWith(
      'error',
      'Registration',
      'Registration session expired. Please register again.'
    );

    expect(navigateSpy).toHaveBeenCalledWith([
      '/auth/register',
    ]);
  });

  // ---------------------------------------------------------
  // Form validation
  // ---------------------------------------------------------

  it('should make OTP required', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    const otpControl = component.getControl('otp');

    expect(otpControl?.invalid).toBe(true);

    expect(
      otpControl?.errors?.['required']
    ).toBe(true);
  });

  it('should make OTP valid when entered', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    const otpControl = component.getControl('otp');

    otpControl?.setValue('123456');

    expect(otpControl?.valid).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    component.onFormSubmit();

    expect(apiService.post).not.toHaveBeenCalled();

    expect(
      component.getControl('otp')?.touched
    ).toBe(true);
  });

  // ---------------------------------------------------------
  // Email OTP verification - success
  // ---------------------------------------------------------

  it('should verify email OTP successfully', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    apiService.post.mockReturnValue(
      of({
        status: 'success',
        subject: 'OTP',
        message: 'OTP verified.',
        data: {
          user_id: 'new-user-id',
        },
      })
    );

    const navigateSpy = vi
      .spyOn(router, 'navigate')
      .mockResolvedValue(true);

    component.emailOtpForm.patchValue({
      otp: '123456',
    });

    component.onFormSubmit();

    expect(apiService.post).toHaveBeenCalledWith(
      'accounts/otp_verification/',
      {
        user_id: 'test-user-id',
        otp: '123456',
        otp_type: 'EMAIL',
      }
    );

    expect(toastService.fromResponse)
      .toHaveBeenCalledWith({
        status: 'success',
        subject: 'OTP',
        message: 'OTP verified.',
        data: {
          user_id: 'new-user-id',
        },
      });

    expect(component.isLoading).toBe(false);

    expect(
      sessionStorage.getItem('user_id')
    ).toBe('new-user-id');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/auth/phone-verify',
    ]);
  });

  // ---------------------------------------------------------
  // Email OTP verification - backend error
  // ---------------------------------------------------------

  it('should handle unsuccessful OTP verification response', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    apiService.post.mockReturnValue(
      of({
        status: 'error',
        subject: 'OTP',
        message: 'Invalid OTP.',
      })
    );

    component.emailOtpForm.patchValue({
      otp: '111111',
    });

    component.onFormSubmit();

    expect(apiService.post).toHaveBeenCalled();

    expect(toastService.fromResponse)
      .toHaveBeenCalledWith({
        status: 'error',
        subject: 'OTP',
        message: 'Invalid OTP.',
      });

    expect(component.isLoading).toBe(false);
  });

  // ---------------------------------------------------------
  // Email OTP verification - API error
  // ---------------------------------------------------------

  it('should handle OTP verification API error', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    apiService.post.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    component.emailOtpForm.patchValue({
      otp: '123456',
    });

    component.onFormSubmit();

    expect(component.isLoading).toBe(false);

    expect(toastService.show).toHaveBeenCalledWith(
      'error',
      'Error',
      'OTP verification failed. Please try again.'
    );
  });

  // ---------------------------------------------------------
  // Resend email OTP
  // ---------------------------------------------------------

  it('should resend email OTP successfully', () => {
    sessionStorage.setItem('test-user-id', 'test-user-id');

    fixture.detectChanges();

    apiService.post.mockReturnValue(
      of({
        status: 'success',
        subject: 'OTP',
        message: 'OTP resent successfully.',
      })
    );

    component.resendOtp();

    expect(apiService.post).toHaveBeenCalledWith(
      'accounts/resend_otp/',
      {
        user_id: 'test-user-id',
        otp_type: 'EMAIL',
      }
    );

    expect(toastService.fromResponse)
      .toHaveBeenCalledWith({
        status: 'success',
        subject: 'OTP',
        message: 'OTP resent successfully.',
      });
  });

  // ---------------------------------------------------------
  // Resend email OTP - API error
  // ---------------------------------------------------------

  it('should handle resend OTP API error', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    apiService.post.mockReturnValue(
      throwError(() => new Error('Network error'))
    );

    component.resendOtp();

    expect(toastService.show).toHaveBeenCalledWith(
      'error',
      'Error',
      'Resend failed. Please try again.'
    );
  });

  // ---------------------------------------------------------
  // Resend without user_id
  // ---------------------------------------------------------

  it('should not call API when resendOtp is called without user_id', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    (component as any).userId = null;

    component.resendOtp();

    expect(apiService.post).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------
  // getControl
  // ---------------------------------------------------------

  it('should return the requested form control', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    const control = component.getControl('otp');

    expect(control).toBe(
      component.emailOtpForm.get('otp')
    );
  });

  it('should return null for an unknown control', () => {
    sessionStorage.setItem('user_id', 'test-user-id');

    fixture.detectChanges();

    expect(
      component.getControl('unknown')
    ).toBeNull();
  });
});