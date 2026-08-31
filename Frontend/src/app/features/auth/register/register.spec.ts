import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  // ---------------------------------------
  // COMPONENT CREATION
  // ---------------------------------------

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------------------
  // FORM INITIALIZATION
  // ---------------------------------------

  it('should initialize the registration form', () => {
    expect(component.adminRegisterForm).toBeTruthy();
  });

  it('should initialize the form as invalid', () => {
    expect(component.adminRegisterForm.invalid).toBe(true);
  });

  // ---------------------------------------
  // FORM CONTROLS
  // ---------------------------------------

  it('should contain all required form controls', () => {
    expect(component.adminRegisterForm.contains('first_name')).toBe(true);
    expect(component.adminRegisterForm.contains('middle_name')).toBe(true);
    expect(component.adminRegisterForm.contains('last_name')).toBe(true);
    expect(component.adminRegisterForm.contains('email')).toBe(true);
    expect(component.adminRegisterForm.contains('phone')).toBe(true);
    expect(component.adminRegisterForm.contains('password')).toBe(true);
    expect(component.adminRegisterForm.contains('confirm_password')).toBe(true);
    expect(
      component.adminRegisterForm.contains('terms_and_conditions')
    ).toBe(true);
  });

  // ---------------------------------------
  // FIRST NAME
  // ---------------------------------------

  it('should require first name', () => {
    const control = component.getControl('first_name');

    control?.setValue('');

    expect(control?.invalid).toBe(true);
    expect(control?.errors?.['required']).toBeTruthy();
  });

  it('should reject first name shorter than 3 characters', () => {
    const control = component.getControl('first_name');

    control?.setValue('AB');

    expect(control?.invalid).toBe(true);
    expect(control?.errors?.['minlength']).toBeTruthy();
  });

  it('should accept a valid first name', () => {
    const control = component.getControl('first_name');

    control?.setValue('RAVI');

    expect(control?.valid).toBe(true);
  });

  // ---------------------------------------
  // LAST NAME
  // ---------------------------------------

  it('should require last name', () => {
    const control = component.getControl('last_name');

    control?.setValue('');

    expect(control?.invalid).toBe(true);
    expect(control?.errors?.['required']).toBeTruthy();
  });

  it('should reject last name shorter than 3 characters', () => {
    const control = component.getControl('last_name');

    control?.setValue('AB');

    expect(control?.invalid).toBe(true);
  });

  it('should accept a valid last name', () => {
    const control = component.getControl('last_name');

    control?.setValue('GORLA');

    expect(control?.valid).toBe(true);
  });

  // ---------------------------------------
  // MIDDLE NAME
  // ---------------------------------------

  it('should allow empty middle name', () => {
    const control = component.getControl('middle_name');

    control?.setValue('');

    expect(control?.valid).toBe(true);
  });

  it('should reject middle name longer than 20 characters', () => {
    const control = component.getControl('middle_name');

    control?.setValue('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

    expect(control?.invalid).toBe(true);
  });

  // ---------------------------------------
  // EMAIL
  // ---------------------------------------

  it('should require email', () => {
    const control = component.getControl('email');

    control?.setValue('');

    expect(control?.invalid).toBe(true);
    expect(control?.errors?.['required']).toBeTruthy();
  });

  it('should reject invalid email', () => {
    const control = component.getControl('email');

    control?.setValue('invalid-email');

    expect(control?.invalid).toBe(true);
  });

  it('should accept valid email', () => {
    const control = component.getControl('email');

    control?.setValue('ravi@gmail.com');

    expect(control?.valid).toBe(true);
  });

  // ---------------------------------------
  // PHONE
  // ---------------------------------------

  it('should require phone number', () => {
    const control = component.getControl('phone');

    control?.setValue('');

    expect(control?.invalid).toBe(true);
  });

  it('should reject phone number starting with invalid digit', () => {
    const control = component.getControl('phone');

    control?.setValue('5123456789');

    expect(control?.invalid).toBe(true);
  });

  it('should reject phone number with less than 10 digits', () => {
    const control = component.getControl('phone');

    control?.setValue('987654321');

    expect(control?.invalid).toBe(true);
  });

  it('should accept valid phone number', () => {
    const control = component.getControl('phone');

    control?.setValue('9876543210');

    expect(control?.valid).toBe(true);
  });

  // ---------------------------------------
  // PASSWORD
  // ---------------------------------------

  it('should require password', () => {
    const control = component.getControl('password');

    control?.setValue('');

    expect(control?.invalid).toBe(true);
  });

  it('should reject password shorter than 6 characters', () => {
    const control = component.getControl('password');

    control?.setValue('Ab1!');

    expect(control?.invalid).toBe(true);
    expect(control?.errors?.['minlength']).toBeTruthy();
  });

  it('should reject weak password', () => {
    const control = component.getControl('password');

    control?.setValue('password');

    expect(control?.invalid).toBe(true);
  });

  it('should accept strong password', () => {
    const control = component.getControl('password');

    control?.setValue('Ravi@123');

    expect(control?.valid).toBe(true);
  });

  // ---------------------------------------
  // CONFIRM PASSWORD
  // ---------------------------------------

  it('should require confirm password', () => {
    const control = component.getControl('confirm_password');

    control?.setValue('');

    expect(control?.invalid).toBe(true);
  });

  it('should reject non-matching passwords', () => {
    component.getControl('password')?.setValue('Ravi@123');
    component.getControl('confirm_password')?.setValue('Ravi@456');

    expect(
      component.getControl('confirm_password')?.invalid
    ).toBe(true);
  });

  it('should accept matching passwords', () => {
    component.getControl('password')?.setValue('Ravi@123');
    component.getControl('confirm_password')?.setValue('Ravi@123');

    expect(
      component.getControl('confirm_password')?.valid
    ).toBe(true);
  });

  // ---------------------------------------
  // TERMS AND CONDITIONS
  // ---------------------------------------

  it('should require terms and conditions', () => {
    const control = component.getControl('terms_and_conditions');

    control?.setValue(false);

    expect(control?.invalid).toBe(true);
    expect(control?.errors?.['required']).toBeTruthy();
  });

  it('should accept terms and conditions when checked', () => {
    const control = component.getControl('terms_and_conditions');

    control?.setValue(true);

    expect(control?.valid).toBe(true);
  });

  // ---------------------------------------
  // PASSWORD VISIBILITY
  // ---------------------------------------

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword).toBe(false);

    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBe(true);

    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBe(false);
  });

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------

  it('should not submit an invalid form', () => {
    component.onFormSubmit();

    expect(component.adminRegisterForm.invalid).toBe(true);
  });

  it('should mark all controls as touched when submitting invalid form', () => {
    component.onFormSubmit();

    Object.keys(component.adminRegisterForm.controls).forEach(
      (controlName) => {
        expect(
          component.getControl(controlName)?.touched
        ).toBe(true);
      }
    );
  });

  it('should have a valid form when all valid data is provided', () => {
    component.adminRegisterForm.setValue({
      first_name: 'RAVI',
      middle_name: '',
      last_name: 'GORLA',
      email: 'ravi@gmail.com',
      phone: '9876543210',
      password: 'Ravi@123',
      confirm_password: 'Ravi@123',
      terms_and_conditions: true
    });

    expect(component.adminRegisterForm.valid).toBe(true);
  });
});