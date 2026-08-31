import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { environment } from '../../../../environments/environment';
import { Destroyer } from '../../../reusable/destroyer/destroyer';
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { RouterLink } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  standalone: true,
  imports: [LabelComponent, InputFieldComponent, FormsModule, ReactiveFormsModule, RouterLink, ButtonModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register extends Destroyer implements OnInit {
  private readonly baseUrl = environment.apiUrl;
  showPassword = false;
  showConfirmPassword = false;
  isLoading: boolean = true;

  constructor(
    protected readonly appConfig: AppConfigService,
    private fb: FormBuilder,
  ) { super(); }

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
