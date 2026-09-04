import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { Destroyer } from '../../../reusable/destroyer/destroyer';
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { AppConfigService } from '../../../core/services/app-config.service';
import { ApiService } from '../../../core/services/api.service';
import { GlobalToastService } from '../../../core/services/global-toast.service';
import { ThemeToggle } from "../../../shared/components/common/theme-toggle/theme-toggle";

@Component({
  standalone: true,
  imports: [LabelComponent, InputFieldComponent, FormsModule, ReactiveFormsModule, RouterLink, ButtonModule, ThemeToggle],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register extends Destroyer implements OnInit {
  showPassword = false;
  showConfirmPassword = false;
  isLoading: boolean = true;

  protected readonly appConfig = inject(AppConfigService);
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toast = inject(GlobalToastService);

  constructor() { super(); }

  adminRegisterForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.isLoading = false;
  }

  private initForm(): void {
    this.adminRegisterForm = this.fb.group({
      first_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          CustomValidators.noDoubleSpaces(),
          CustomValidators.noSpecialCharsWithDotHyphen(),
        ],
      ],
      middle_name: [
        '',
        [
          Validators.maxLength(20),
          CustomValidators.noDoubleSpaces(),
          CustomValidators.noSpecialCharsWithDotHyphen(),
        ],
      ],
      last_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          CustomValidators.noDoubleSpaces(),
          CustomValidators.noSpecialCharsWithDotHyphen(),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          CustomValidators.emailPattern(),
          CustomValidators.noDoubleSpaces(),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          CustomValidators.phoneValidator(),
          CustomValidators.noDoubleSpaces(),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          CustomValidators.strongPassword(),
        ],
      ],
      confirm_password: [
        '',
        [
          Validators.required,
        ],
      ],
      terms_and_conditions: [
        false,
        [
          Validators.requiredTrue,
        ],
      ],
    },
      {
        validators: [
          CustomValidators.matchPasswords(
            'password',
            'confirm_password'
          ),
        ],
      });
  }

  onFormSubmit(): void {
    if (this.adminRegisterForm.invalid) {
      this.adminRegisterForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.apiService
      .post('accounts/register/', this.adminRegisterForm.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status === 'success') {
            const data = response.data;
            sessionStorage.setItem('user_id', data.user_id);
            this.adminRegisterForm.reset();
            this.toast.fromResponse(response);
            this.router.navigate(['/auth/email-verify']);
            return;
          }
          this.toast.fromResponse(response);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration failed:', error);
          this.toast.show('error', 'Error', 'Registration failed. Please try again.');
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getControl(name: string): AbstractControl | null {
    return this.adminRegisterForm.get(name);
  }
}
