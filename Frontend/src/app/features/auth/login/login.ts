import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { AppConfigService } from '../../../core/services/app-config.service';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalToastService } from '../../../core/services/global-toast.service';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { ThemeToggle } from '../../../shared/components/common/theme-toggle/theme-toggle';
import { PageLoader } from '../../../shared/components/ui/loaders/page-loaders/page-loader';

@Component({
  standalone: true,
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  imports: [LabelComponent, InputFieldComponent, FormsModule, ReactiveFormsModule, RouterLink, ButtonModule, ThemeToggle, PageLoader,],
})
export class Login implements OnInit {
  showPassword = false;
  isSubmitting = false;
  isPageLoading = true;

  loginForm!: FormGroup;

  protected readonly appConfig = inject(AppConfigService);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(GlobalToastService);

  ngOnInit(): void {
    this.initForm();
    this.isPageLoading = false;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, CustomValidators.noDoubleSpaces(),],],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), CustomValidators.strongPassword(),],],
    });
  }

  onFormSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.status !== 'success') {
            this.toast.fromResponse(response);
            return;
          }
          const token = response.data?.token;
          if (!token) {
            this.toast.show('error', 'Login', 'Login token was not received.');
            return;
          }
          this.authService.setToken(token);

          this.loginForm.reset();
          this.toast.fromResponse(response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.toast.show('error', 'Error', 'Login failed. Please try again.');
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getControl(name: string): any {
    return this.loginForm.get(name);
  }
}