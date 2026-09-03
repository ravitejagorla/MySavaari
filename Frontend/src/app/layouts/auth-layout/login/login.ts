import { Component, OnInit, inject } from '@angular/core';
import { Destroyer } from '../../../reusable/destroyer/destroyer';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AppConfigService } from '../../../core/services/app-config.service';
import { GlobalToastService } from '../../../core/services/global-toast.service';
import { Router, RouterLink } from '@angular/router';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { ButtonModule } from 'primeng/button';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { ThemeToggle } from "../../../shared/components/common/theme-toggle/theme-toggle";
import { finalize } from 'rxjs';
@Component({
  standalone: true,
  imports: [LabelComponent, InputFieldComponent, FormsModule, ReactiveFormsModule, RouterLink, ButtonModule, ThemeToggle],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login extends Destroyer implements OnInit {
  showPassword = false;
  isSubmitting: boolean = false;
  isPageLoading: boolean = true;
  loginForm!: FormGroup;

  protected readonly appConfig = inject(AppConfigService);
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private toast = inject(GlobalToastService);

  constructor() { super(); }

  ngOnInit(): void {
    this.initForm();
    this.isPageLoading = false;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, CustomValidators.noDoubleSpaces(),]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), CustomValidators.strongPassword(),],]
    })
  }

  onFormSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;

  this.apiService
    .post('accounts/login/', this.loginForm.value)
    .pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    )
    .subscribe({
      next: (response) => {        
        if (response.status === 'success') {
          const token = response.data?.token;

          if (!token) {
            this.toast.show(
              'error',
              'Login',
              'Login token was not received.'
            );
            return;
          }
          sessionStorage.setItem('access_token', token);
          this.loginForm.reset();
          this.toast.fromResponse(response);
          this.router.navigate(['/']);
          return;
        }
        this.toast.fromResponse(response);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.toast.show(
          'error',
          'Error',
          'Login failed. Please try again.'
        );
      }
    });
}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getControl(name: string): any {
    return this.loginForm.get(name);
  }
}
