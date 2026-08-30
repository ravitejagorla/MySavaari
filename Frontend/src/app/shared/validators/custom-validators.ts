import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, AsyncValidatorFn, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

export class CustomValidators {
  // --- Helper for Cross-Control/Group Validators ---
  private static readonly ESTABLISH_DATE_ERROR_KEY = 'establishDate';
  private static readonly Future_DATE_ERROR_KEY = 'isFutureDate';
  private static readonly MIN_AGE_ERROR_KEY = 'minAge18';
  // Minimum required age
  private static readonly MIN_AGE = 18;

  /**
   * Helper function to safely clear a specific error key on a control 
   * while preserving any other existing validation errors (like 'required').
   * @param control The control to modify.
   * @param errorKey The key of the error to remove.
   */
  private static clearSpecificError(control: AbstractControl | null, errorKey: string): void {
    if (control && control.errors && control.errors[errorKey]) {
      // Use object destructuring to safely remove the specific error key
      const { [errorKey]: _, ...rest } = control.errors;

      // Set errors to the remaining ones, or null if no errors are left
      control.setErrors(Object.keys(rest).length > 0 ? rest : null);
    }
  }
  // --------------------------------------------------

  // No special characters, only letters and single spaces between words
  static noSpecialChars(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const valid = /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value); // No double spaces
      return valid ? null : { invalidChars: true };
    };
  }
  static decimalNumbers(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const valid = /^[0-9]+(\.[0-9]+)?$/.test(value); // Allows: 123, 123.45
    return valid ? null : { decimalNumbers: true };
  };
}
  // Allows letters, single spaces, dots, and hyphens (no consecutive special chars or double spaces)
  static noSpecialCharsWithDotHyphen(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Allowed: A-Z, a-z, space, dot, hyphen
      // Disallowed: double spaces, consecutive dots/hyphens, special chars like @, #, $, etc.
      // NOTE: The original regex /^[A-Za-z]+(?:[ .-][A-Za-z]+)*$/.test(value) is strict.
      const valid = /^[A-Za-z .-]+$/.test(value) && !/[ .-]{2,}/.test(value.trim());

      return valid ? null : { invalidCharsDotHyphen: true };
    };
  }

  // ✅ Allows letters with single space, dot, or hyphen (no consecutive or leading/trailing special chars)
  // 🚫 Disallows only numbers or only special characters
  static noOnlyNumbersOrSpecialCharsWithDotHyphen(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Has at least one letter
      const hasLetter = /[A-Za-z]/.test(value);

      // Check if only numbers
      const onlyNumbers = /^[0-9]+$/.test(value);

      // Check if only special characters
      const onlySpecials = /^[^A-Za-z0-9]+$/.test(value);

      // Valid if it contains at least one letter and not purely numbers or special chars
      const valid = hasLetter && !onlyNumbers && !onlySpecials;
      return valid ? null : { invalidOnlyNumbersOrSpecialChars: true };
    };
  }

  // Email validation (can use Angular's built-in, but custom if needed)
  static emailPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      return valid ? null : { invalidEmail: true };
    };
  }

  // No consecutive spaces
  static noDoubleSpaces(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const valid = !/\s{2,}/.test(value);
      return valid ? null : { doubleSpaces: true };
    };
  }

  // Password strength (at least one upper, lower, number, special char)
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      // Requires at least 6 characters, one lowercase, one uppercase, one digit, one special character
      const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value);
      return valid ? null : { weakPassword: true };
    };
  }

  // Match password and confirm password
  static matchPasswords(password: string, confirmPassword: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passControl = group.get(password);
      const confirmControl = group.get(confirmPassword);

      if (!passControl || !confirmControl || !confirmControl.value) {
        return null;
      }

      const match = passControl.value === confirmControl.value;

      if (!match) {
        confirmControl.setErrors({ ...confirmControl.errors, passwordsMismatch: true });
        return { passwordsMismatch: true };
      } else {
        // Clear the specific error if valid, preserving others
        CustomValidators.clearSpecificError(confirmControl, 'passwordsMismatch');
        return null;
      }
    };
  }

  // Image size validation (max 2MB)
  static maxFileSize(maxSizeInBytes: number = 2 * 1024 * 1024): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;

      // If no file selected, return null (valid)
      if (!file) return null;

      // Check if it's a File object
      if (file instanceof File) {
        const valid = file.size <= maxSizeInBytes;
        return valid ? null : {
          maxFileSize: {
            actualSize: file.size,
            maxSize: maxSizeInBytes,
            actualSizeMB: (file.size / (1024 * 1024)).toFixed(2),
            maxSizeMB: (maxSizeInBytes / (1024 * 1024)).toFixed(2)
          }
        };
      }

      // If it's not a File object, return null (could be base64 string or URL)
      return null;
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;

      // Must be exactly 10 digits
      if (value.length !== 10) {
        return { invalidPhoneLength: true };
      }

      // Must be only digits
      if (!/^[0-9]*$/.test(value)) {
        return { invalidPhoneChars: true };
      }

      // Must start with 6, 7, 8, or 9
      if (!/^[6-9]/.test(value)) {
        return { invalidPhoneStart: true };
      }

      return null;
    };
  }


  // allows only alphabets and single spaces
  static lettersOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      // Allows letters and single spaces, disallows numbers/double spaces
      const valid = /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value);
      return valid ? null : { lettersOnly: true };
    };
  }

  // Standard Indian GST number format
  static gstNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Indian GSTIN pattern: 2(State Code) + 10(PAN) + 1(Entity Code) + 1(Blank/Z) + 1(Checksum) = 15 chars
      // Pattern: XXAAAAA9999X1ZX
      // const valid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value.toUpperCase());
      const valid = /^[A-Z0-9]{13}Z[A-Z0-9]{1}$/.test(value.toUpperCase());

      return valid ? null : { invalidGST: true };
    };
  }

  static licenseNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasAlphabet = /[A-Za-z]/.test(value);      // at least one letter
      const hasNumber = /[0-9]/.test(value);           // at least one digit

      // Allowed characters + optional slash structure
      const validStructure = /^[A-Za-z0-9]+(?:\/[A-Za-z0-9]+)*$/.test(value);

      return validStructure && hasAlphabet && hasNumber
        ? null
        : { invalidLicense: true };
    };
  }

  static onlyNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // Allows only 0-9
      const valid = /^[0-9]*$/.test(value);

      return valid ? null : { invalidNumber: true };
    };
  }

  // Custom format: NumberXNumber (e.g., 1920x1080)
  static dimensions(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      // 1 to 4 digits, followed by 'x', followed by 1 to 4 digits
      const valid = /^\d{1,4}x\d{1,4}$/.test(value);

      return valid ? null : { invalidDimensions: true };
    };
  }

  // Indian Financial System Code (IFSC) format
  static ifscCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      // 4 letters, 0, 6 digits
      const valid = /^[A-Z]{4}0[0-9]{6}$/.test(value);
      return valid ? null : { ifscCode: true };
    };
  }

  // Generic UPI ID format
  static upiid(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      // Alphanumeric before @, lowercase domain after @
      const valid = /^[0-9a-zA-Z]*@[a-z]*$/.test(value);
      return valid ? null : { upiid: true };
    };
  }

  // Generic registration number (e.g., vehicle, company)
  static registrationNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      // Starts with 4 letters, followed by optional dash and alphanumeric segments
      const valid = /^[A-Z]{4}(?:-[A-Z0-9]*)*$/.test(value);
      return valid ? null : { registrationNumber: true };
    }
  }

  // Detailed Business Registration Number Pattern (Based on your provided complex structure)
  static businessRegistrationPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const cleanedValue = value.toString().replace(/\s/g, '');
      const totalLength = 21; // 1 + 5 + 2 + 4 + 3 + 6 = 21 characters

      // Check total length first
      if (cleanedValue.length !== totalLength) {
        return {
          invalidBusinessRegistration: {
            message: `Must be exactly ${totalLength} characters long`,
            actualLength: cleanedValue.length,
            requiredLength: totalLength
          }
        };
      }

      // Detailed pattern validation with specific error messages
      const patterns = [
        { regex: /^[A-Z]/, position: '1st character', description: 'Must be a letter' },
        { regex: /^[A-Z][0-9]{5}/, position: '2nd-6th characters', description: 'Must be 5 numbers' },
        { regex: /^[A-Z][0-9]{5}[A-Z]{2}/, position: '7th-8th characters', description: 'Must be 2 letters' },
        { regex: /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}/, position: '9th-12th characters', description: 'Must be 4 numbers' },
        { regex: /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}/, position: '13th-15th characters', description: 'Must be 3 letters' },
        { regex: /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, position: '16th-21st characters', description: 'Must be 6 numbers' }
      ];

      for (let i = 0; i < patterns.length; i++) {
        if (!patterns[i].regex.test(cleanedValue)) {
          return {
            invalidBusinessRegistration: {
              message: `Invalid format at ${patterns[i].position}`,
              description: patterns[i].description,
              example: 'U12345AP2020PTC123456'
            }
          };
        }
      }

      return null;
    };
  }

  // License Date Range: fromDate <= today AND toDate >= today AND fromDate <= toDate
  static activeLicenseDateRange(fromDateKey: string, toDateKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }

      const fromControl = group.get(fromDateKey);
      const toControl = group.get(toDateKey);

      if (!fromControl || !toControl || !fromControl.value || !toControl.value) {
        return null;
      }

      const fromDate = new Date(fromControl.value);
      const toDate = new Date(toControl.value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(0, 0, 0, 0);

      let hasError = false;

      // 1. From Date: must be <= today
      if (fromDate.getTime() > today.getTime()) {
        fromControl.setErrors({ ...fromControl.errors, fromDateFuture: true });
        hasError = true;
      } else {
        CustomValidators.clearSpecificError(fromControl, 'fromDateFuture');
      }

      // 2. To Date: must be >= today
      if (toDate.getTime() < today.getTime()) {
        toControl.setErrors({ ...toControl.errors, toDatePast: true });
        hasError = true;
      } else {
        CustomValidators.clearSpecificError(toControl, 'toDatePast');
      }

      // 3. From Date must be strictly less than To Date   (NEW CHANGE)
      if (fromDate.getTime() >= toDate.getTime()) {
        fromControl.setErrors({ ...fromControl.errors, dateOrderInvalid: true });
        toControl.setErrors({ ...toControl.errors, dateOrderInvalid: true });
        hasError = true;
      } else {
        CustomValidators.clearSpecificError(fromControl, 'dateOrderInvalid');
        CustomValidators.clearSpecificError(toControl, 'dateOrderInvalid');
      }

      return hasError ? { activeLicenseDateRangeInvalid: true } : null;
    };
  }


  static establishDate(fromDateKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }

      const fromControl = group.get(fromDateKey);

      if (!fromControl || !fromControl.value) {
        // Clear error if control becomes empty, then exit
        CustomValidators.clearSpecificError(fromControl, CustomValidators.ESTABLISH_DATE_ERROR_KEY);
        return null;
      }

      const fromDate = new Date(fromControl.value);
      const today = new Date();

      // Normalize all dates to start of day (midnight) for accurate comparison
      today.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);

      const isFutureDate = fromDate.getTime() > today.getTime();

      if (isFutureDate) {
        // SET the error on the control
        fromControl.setErrors({ ...fromControl.errors, [CustomValidators.ESTABLISH_DATE_ERROR_KEY]: true });
        return { [CustomValidators.ESTABLISH_DATE_ERROR_KEY]: true };
      } else {
        // CLEAR the error on the control
        CustomValidators.clearSpecificError(fromControl, CustomValidators.ESTABLISH_DATE_ERROR_KEY);
        return null;
      }
    };
  }

  static isFutureDate(fromDateKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }

      const fromControl = group.get(fromDateKey);

      if (!fromControl || !fromControl.value) {
        CustomValidators.clearSpecificError(fromControl, CustomValidators.Future_DATE_ERROR_KEY);
        return null;
      }

      const fromDate = new Date(fromControl.value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      fromDate.setHours(0, 0, 0, 0);

      const isFutureDate = fromDate.getTime() > today.getTime();

      if (isFutureDate) {
        fromControl.setErrors({ ...fromControl.errors, [CustomValidators.Future_DATE_ERROR_KEY]: true });
        return { [CustomValidators.Future_DATE_ERROR_KEY]: true };
      } else {
        CustomValidators.clearSpecificError(fromControl, CustomValidators.Future_DATE_ERROR_KEY);
        return null;
      }
    };
  }

  // Alternate Phone: Checks if two phone number fields have the same value
  static altPhone(num: string, altnum: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) {
        return null;
      }
      const num1Control = group.get(num);
      const num2Control = group.get(altnum);

      if (!num1Control || !num2Control || !num1Control.value || !num2Control.value) {
        // Clear error if a value is missing, then exit
        CustomValidators.clearSpecificError(num2Control, 'altPhone');
        return null;
      }

      const areSame = num1Control.value === num2Control.value;

      if (areSame) {
        num2Control.setErrors({ ...num2Control.errors, altPhone: true });
        return { altPhone: true };
      } else {
        // Clear the specific error if valid
        CustomValidators.clearSpecificError(num2Control, 'altPhone');
        return null;
      }
    };
  }


  static maxImageSize(maxSizeInBytes: number = 1 * 1024 * 1024): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;

      if (!file) return null;
      if (file instanceof File) {
        const valid = file.size <= maxSizeInBytes;
        return valid
          ? null
          : {
            maxImageSize: {
              actualSize: file.size,
              maxSize: maxSizeInBytes,
              actualSizeMB: (file.size / (1024 * 1024)).toFixed(2),
              maxSizeMB: (maxSizeInBytes / (1024 * 1024)).toFixed(2),
            },
          };
      }

      return null;
    };
  }

  static imageDimensions(
    minWidth: number = 200,
    minHeight: number = 200,
    maxWidth: number = 400,
    maxHeight: number = 400
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const file = control.value as File;

      if (!file || !(file instanceof File)) {
        return of(null);
      }

      return new Observable<ValidationErrors | null>((observer) => {
        if (!file.type.startsWith('image/')) {
          observer.next({ invalidFileType: true });
          observer.complete();
          return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
          const image = new Image();

          image.onload = () => {
            const { width, height } = image;
            let errors: ValidationErrors | null = null;

            if (
              width < minWidth ||
              height < minHeight ||
              width > maxWidth ||
              height > maxHeight
            ) {
              errors = {
                imageDimensions: {
                  requiredMin: `${minWidth}x${minHeight}`,
                  requiredMax: `${maxWidth}x${maxHeight}`,
                  actual: `${width}x${height}`,
                  widthViolation:
                    width < minWidth ? 'min' : width > maxWidth ? 'max' : null,
                  heightViolation:
                    height < minHeight ? 'min' : height > maxHeight ? 'max' : null,
                },
              };
            }

            observer.next(errors);
            observer.complete();
          };

          image.onerror = () => {
            observer.next({ imageLoadError: true });
            observer.complete();
          };

          image.src = e.target?.result as string;
        };

        reader.onerror = () => {
          observer.next({ fileReadError: true });
          observer.complete();
        };

        reader.readAsDataURL(file);
      });
    };
  }

  private static readonly TIME_RANGE_ERROR_KEY = 'invalidTimeRange';

  static timeRange(fromTimeKey: string, toTimeKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormGroup)) return null;

      const fromControl = group.get(fromTimeKey);
      const toControl = group.get(toTimeKey);

      // Exit validation if controls or values are missing (required handles this)
      if (!fromControl || !toControl || !fromControl.value || !toControl.value) {
        CustomValidators.clearSpecificError(fromControl, CustomValidators.TIME_RANGE_ERROR_KEY);
        CustomValidators.clearSpecificError(toControl, CustomValidators.TIME_RANGE_ERROR_KEY);
        return null;
      }

      // Ensure values are Date objects for proper time comparison
      const fromTime = fromControl.value instanceof Date ? fromControl.value : new Date(fromControl.value);
      const toTime = toControl.value instanceof Date ? toControl.value : new Date(toControl.value);

      // Check if From Time is greater than or equal to To Time (i.e., invalid range)
      if (fromTime.getTime() >= toTime.getTime()) {
        // Set error on both controls (group validation errors are also returned)
        fromControl.setErrors({ ...fromControl.errors, [CustomValidators.TIME_RANGE_ERROR_KEY]: true });
        toControl.setErrors({ ...toControl.errors, [CustomValidators.TIME_RANGE_ERROR_KEY]: true });
        return { [CustomValidators.TIME_RANGE_ERROR_KEY]: true };
      } else {
        // Clear error on both controls
        CustomValidators.clearSpecificError(fromControl, CustomValidators.TIME_RANGE_ERROR_KEY);
        CustomValidators.clearSpecificError(toControl, CustomValidators.TIME_RANGE_ERROR_KEY);
        return null;
      }
    };
  }

  static alphaNumeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null;

      // Allows letters/numbers separated by a single space, dash, or underscore
      const valid = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(value);

      return valid ? null : { alphaNumeric: true };
    };
  }

  static website(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null; // Skip empty value (handled by required if needed)

      /**
       * ✅ This pattern allows:
       * - Optional http:// or https://
       * - Optional www.
       * - Domain with letters, numbers, and hyphens
       * - Multiple domain parts (like example.co.in)
       * - Optional port and path
       */
      const pattern =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,}){1,}(:[0-9]{1,5})?(\/[^\s]*)?$/;

      const valid = pattern.test(value);
      return valid ? null : { website: true };
    };
  }

  static establishBeforeRegistered(establishKey: string, registeredKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const establishCtrl = group.get(establishKey);
      const registeredCtrl = group.get(registeredKey);

      if (!establishCtrl || !registeredCtrl) return null;

      const est = new Date(establishCtrl.value);
      const reg = new Date(registeredCtrl.value);

      // Clear previous error
      establishCtrl.setErrors(null);

      if (!est || !reg) return null;

      // Strict check: established < registered
      if (est <= reg) {
        establishCtrl.setErrors({ establishNotEarlier: true });
      }

      return null;
    };
  }

  static panCardNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // A PAN is 10 characters long, all uppercase
      const value: string = control.value?.trim().toUpperCase();

      // Regular Expression for PAN: 5 Alphabets, 4 Digits, 1 Alphabet
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      // Check if the trimmed, uppercased value matches the PAN format
      const valid = panRegex.test(value);

      // Return null if valid, or a ValidationErrors object if invalid
      return valid ? null : { panCardNumber: true };
    }
  }

  static isEighteenOrOlder(dobControlKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (!(group instanceof FormControl || group instanceof FormGroup)) {
        return null;
      }

      const dobControl = group instanceof FormGroup ? group.get(dobControlKey) : (group as FormControl);

      if (!dobControl || !dobControl.value) {
        CustomValidators.clearSpecificError(dobControl, CustomValidators.MIN_AGE_ERROR_KEY);
        return null;
      }

      const dobDate = new Date(dobControl.value);

      if (isNaN(dobDate.getTime())) {
        CustomValidators.clearSpecificError(dobControl, CustomValidators.MIN_AGE_ERROR_KEY);
        return null;
      }

      const today = new Date();
      const cutoffDate = new Date(today.getFullYear() - CustomValidators.MIN_AGE, today.getMonth(), today.getDate());

      const isTooYoung = dobDate.getTime() > cutoffDate.getTime();

      if (isTooYoung) {
        dobControl.setErrors({
          ...dobControl.errors,
          [CustomValidators.MIN_AGE_ERROR_KEY]: {
            requiredAge: CustomValidators.MIN_AGE,
            cutoff: cutoffDate.toISOString().substring(0, 10)
          }
        });
        return { [CustomValidators.MIN_AGE_ERROR_KEY]: true };
      } else {
        CustomValidators.clearSpecificError(dobControl, CustomValidators.MIN_AGE_ERROR_KEY);
        return null;
      }
    };
  }

static dateOrderValidator(fromDateKey: string, toDateKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        if (!(group instanceof FormGroup)) {
            return null;
        }

        const fromControl = group.get(fromDateKey);
        const toControl = group.get(toDateKey);

        if (!fromControl || !toControl || !fromControl.value || !toControl.value) {
            CustomValidators.clearSpecificError(fromControl, 'dateOrderInvalid');
            CustomValidators.clearSpecificError(toControl, 'dateOrderInvalid');
            return null;
        }

        const fromDate = new Date(fromControl.value);
        const toDate = new Date(toControl.value);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(0, 0, 0, 0);

        if (fromDate.getTime() >= toDate.getTime()) {
            const error = { dateOrderInvalid: true };

            fromControl.setErrors({ ...fromControl.errors, ...error });
            toControl.setErrors({ ...toControl.errors, ...error });

            return { dateOrderInvalid: true };

        } else {

            CustomValidators.clearSpecificError(fromControl, 'dateOrderInvalid');
            CustomValidators.clearSpecificError(toControl, 'dateOrderInvalid');

            return null;
        }
    };
}

}