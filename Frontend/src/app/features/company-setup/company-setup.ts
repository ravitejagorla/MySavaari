import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router } from '@angular/router';

import { GlobalToastService } from '../../core/services/global-toast.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

import { BasicCard } from '../../shared/components/ui/cards/basic-card/basic-card';
import { PageLoader } from '../../shared/components/ui/loaders/page-loaders/page-loader';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { CustomValidators } from '../../shared/validators/custom-validators';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePicker } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { ThemeToggle } from '../../shared/components/common/theme-toggle/theme-toggle';
import { AreaSearchInputComponent } from '../../shared/components/area-search-input.component';

@Component({
  selector: 'ras-company-setup',
  standalone: true,
  imports: [
    AreaSearchInputComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // InputTextModule,
    // StepsModule,
    ButtonModule,
    LabelComponent,
    InputFieldComponent,
    ThemeToggle,
    // StepperModule,
      CheckboxModule,
    // TextareaModule,
    DatePicker,
    // Select,
    MenuModule,
    DialogModule,
    EditorModule,
    PageLoader
],
  templateUrl: './company-setup.html',
  styleUrl: './company-setup.css',
})
export class CompanySetup implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(GlobalToastService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly api = inject(ApiService);

  isPageLoading = true;
  isLoading = false;
  showMoreInfo = false;
  showPassword = false;
  showConfirmPassword = false;

  oneTimeForm!: FormGroup;

  items = [
    {
      label: 'Signout',
      icon: 'pi pi-sign-out',
      command: () => this.signOut(),
    },
  ];

  readonly todayDate = new Date();

  areaValue: unknown = null;
  cityValue = '';
  stateValue = '';
  countryValue = '';
  areaList: unknown[] = [];

  companyType: unknown[] = [];

  iconPreview: string | null = null;
  logoPreview: string | null = null;
  coverPreview: string | null = null;

  iconFile: File | null = null;
  logoFile: File | null = null;
  coverFile: File | null = null;

  ngOnInit(): void {
    this.initForm();
    this.setup24HourAvailabilityListener();

    this.isPageLoading = false;
  }

  private initForm(): void {
    this.oneTimeForm = this.fb.group(
      {
        company_registered_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(70), CustomValidators.noDoubleSpaces(), CustomValidators.noOnlyNumbersOrSpecialCharsWithDotHyphen(),],],
        company_short_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), CustomValidators.noDoubleSpaces(), CustomValidators.noOnlyNumbersOrSpecialCharsWithDotHyphen(),],],
        state_of_recognitation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), CustomValidators.noDoubleSpaces(), CustomValidators.lettersOnly(),],],
        registration_number: ['', [Validators.required, Validators.maxLength(30), CustomValidators.noDoubleSpaces(), CustomValidators.registrationNumber(),],],
        license_number: ['', [Validators.required, Validators.maxLength(30), CustomValidators.noDoubleSpaces(), CustomValidators.licenseNumber(),],],
        // company_type: ['',[  Validators.required,  CustomValidators.noDoubleSpaces(),],],
        phone_number: ['', [Validators.required, CustomValidators.phoneValidator(),],],
        emergency_number: ['', [Validators.required, CustomValidators.phoneValidator(),],],
        email: ['', [Validators.required, Validators.email,],],
        is_available_24_7: [false],
        time_from: ['', [Validators.required],],
        time_to: ['', [Validators.required],],
        area: ['', [Validators.required],],
        city: [{ value: '', disabled: true, },],
        state: [{ value: '', disabled: true, },],
        country: [{ value: '', disabled: true, },],
        address: ['', [Validators.required, Validators.maxLength(250),],],
        company_description: [null, [Validators.maxLength(1000)],],
        company_icon: [null, [Validators.required, CustomValidators.maxImageSize(1 * 1024 * 1024),], [CustomValidators.imageDimensions(30, 30, 400, 400),],],
        company_logo: [null, [Validators.required, CustomValidators.maxImageSize(1 * 1024 * 1024),], [CustomValidators.imageDimensions(30, 30, 400, 400),],],
        company_cover: [null, [CustomValidators.maxImageSize(1 * 1024 * 1024),], [CustomValidators.imageDimensions(600, 200, 3200, 800),],],
        establish_date: ['', [Validators.required],],
        registration_date: ['', [Validators.required],],
        company_website: ['', [CustomValidators.website()],],
        branch_identity_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), CustomValidators.noDoubleSpaces(), CustomValidators.noOnlyNumbersOrSpecialCharsWithDotHyphen(),],],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), CustomValidators.strongPassword(),],],
        confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16),],],
      },
      {
        validators: [
          CustomValidators.establishDate('establish_date'),
          CustomValidators.establishDate('registration_date'),
          CustomValidators.altPhone('phone_number', 'emergency_number'),
          CustomValidators.timeRange('time_from', 'time_to'),
          CustomValidators.matchPasswords('password', 'confirm_password'),
          CustomValidators.establishBeforeRegistered('establish_date', 'registration_date'),
        ],
      }
    );
  }

  private setup24HourAvailabilityListener(): void {
    const control = this.oneTimeForm.get('is_available_24_7');

    control?.valueChanges.subscribe((isAvailable24h: boolean) => {
      const timeFromControl = this.oneTimeForm.get('time_from');
      const timeToControl = this.oneTimeForm.get('time_to');

      if (isAvailable24h) {
        timeFromControl?.clearValidators();
        timeToControl?.clearValidators();

        timeFromControl?.setValue(null);
        timeToControl?.setValue(null);
      } else {
        timeFromControl?.setValidators([Validators.required]);
        timeToControl?.setValidators([Validators.required]);
      }

      timeFromControl?.updateValueAndValidity();
      timeToControl?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  signOut(): void {
    this.userService.clearUser();
    this.authService.logout();
    this.toast.show('success', 'Logout', 'Logged out successfully');
  }

  getControl(name: string): AbstractControl | null {
    return this.oneTimeForm.get(name);
  }

  handleAreaSelect(selectedArea: any): void {
    this.cityValue = selectedArea.city_instance?.city_name ?? '';
    this.stateValue = selectedArea.state_instance?.state_name ?? '';
    this.countryValue = selectedArea.country_instance?.country_name ?? '';
    this.oneTimeForm.get('area')?.setValue(selectedArea.id);
  }

  handleAreaClear(): void {
    this.cityValue = '';
    this.stateValue = '';
    this.countryValue = '';
    this.oneTimeForm.get('area')?.setValue('');
  }

  onImageSelect(event: Event, type: 'icon' | 'logo' | 'cover'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const controlName = `company_${type}`;
    const control = this.oneTimeForm.get(controlName);

    if (!file) {
      control?.setValue(null);
      control?.markAsTouched();
      control?.updateValueAndValidity();
      return;
    }

    control?.setValue(file);
    control?.markAsTouched();

    const reader = new FileReader();

    reader.onload = () => {
      const previewUrl = reader.result as string;

      switch (type) {
        case 'icon':
          this.iconFile = file;
          this.iconPreview = previewUrl;
          break;

        case 'logo':
          this.logoFile = file;
          this.logoPreview = previewUrl;
          break;

        case 'cover':
          this.coverFile = file;
          this.coverPreview = previewUrl;
          break;
      }

      control?.updateValueAndValidity();
    };

    reader.readAsDataURL(file);
  }

  removeImage(type: 'icon' | 'logo' | 'cover'): void {
    const controlName = `company_${type}`;
    const control = this.oneTimeForm.get(controlName);

    switch (type) {
      case 'icon':
        this.iconFile = null;
        this.iconPreview = null;
        break;

      case 'logo':
        this.logoFile = null;
        this.logoPreview = null;
        break;

      case 'cover':
        this.coverFile = null;
        this.coverPreview = null;
        break;
    }

    control?.setValue(null);
    control?.markAsTouched();
    control?.updateValueAndValidity();

    this.clearFileInput(controlName);
  }

  private clearFileInput(id: string): void {
    const input = document.getElementById(id) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }

  oneTimeFormSubmit(): void {
    if (this.oneTimeForm.invalid) {
      this.oneTimeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();

    Object.entries(this.oneTimeForm.getRawValue()).forEach(
      ([key, value]) => {
        if (!(value instanceof File) && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    );

    if (this.iconFile) {
      formData.append('company_icon', this.iconFile);
    }

    if (this.logoFile) {
      formData.append('company_logo', this.logoFile);
    }

    if (this.coverFile) {
      formData.append('company_cover', this.coverFile);
    }

    this.api.post('company/one-timeProfile-setup/create/', formData)
      .subscribe({
        next: (res: any) => {
          this.toast.fromResponse(res);

          if (res.status === 'success') {
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('company_log', JSON.stringify(res.data));
            this.toast.show('success', 'Profile Setup', 'Profile setup successful');
            this.router.navigate(['/']);
          }
          this.isLoading = false;
        },

        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.toast.show('error', 'Submission Failed', 'An error occurred during profile setup.');
        },
      });
  }

  onReset(): void {
    this.oneTimeForm.reset({ is_available_24_7: false, });

    this.iconFile = null;
    this.logoFile = null;
    this.coverFile = null;

    this.iconPreview = null;
    this.logoPreview = null;
    this.coverPreview = null;

    this.clearFileInput('companyIcon');
    this.clearFileInput('companyLogo');
    this.clearFileInput('companyCover');

    this.cityValue = '';
    this.stateValue = '';
    this.countryValue = '';

    this.oneTimeForm.get('area')?.setValue('');

    this.oneTimeForm.markAsPristine();
    this.oneTimeForm.markAsUntouched();
  }
}
