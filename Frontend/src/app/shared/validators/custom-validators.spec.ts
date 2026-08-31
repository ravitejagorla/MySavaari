import { FormControl, FormGroup } from '@angular/forms';

import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {

  // ---------------------------------------
  // noSpecialChars
  // ---------------------------------------

  describe('noSpecialChars', () => {

    it('should accept letters with single spaces', () => {
      const control = new FormControl('Ravi Teja');

      const result = CustomValidators.noSpecialChars()(control);

      expect(result).toBeNull();
    });

    it('should reject double spaces', () => {
      const control = new FormControl('Ravi  Teja');

      const result = CustomValidators.noSpecialChars()(control);

      expect(result?.['invalidChars']).toBe(true);
    });

    it('should reject special characters', () => {
      const control = new FormControl('Ravi@Teja');

      const result = CustomValidators.noSpecialChars()(control);

      expect(result?.['invalidChars']).toBe(true);
    });

    it('should allow empty value', () => {
      const control = new FormControl('');

      const result = CustomValidators.noSpecialChars()(control);

      expect(result).toBeNull();
    });

  });


  // ---------------------------------------
  // decimalNumbers
  // ---------------------------------------

  describe('decimalNumbers', () => {

    it('should accept integer numbers', () => {
      const control = new FormControl('123');

      const result = CustomValidators.decimalNumbers()(control);

      expect(result).toBeNull();
    });

    it('should accept decimal numbers', () => {
      const control = new FormControl('123.45');

      const result = CustomValidators.decimalNumbers()(control);

      expect(result).toBeNull();
    });

    it('should reject alphabetic values', () => {
      const control = new FormControl('123abc');

      const result = CustomValidators.decimalNumbers()(control);

      expect(result?.['decimalNumbers']).toBe(true);
    });

    it('should reject multiple decimal points', () => {
      const control = new FormControl('123.45.67');

      const result = CustomValidators.decimalNumbers()(control);

      expect(result?.['decimalNumbers']).toBe(true);
    });

  });


  // ---------------------------------------
  // EMAIL
  // ---------------------------------------

  describe('emailPattern', () => {

    it('should accept valid email', () => {
      const control = new FormControl('ravi@gmail.com');

      const result = CustomValidators.emailPattern()(control);

      expect(result).toBeNull();
    });

    it('should reject invalid email', () => {
      const control = new FormControl('invalid-email');

      const result = CustomValidators.emailPattern()(control);

      expect(result?.['invalidEmail']).toBe(true);
    });

    it('should reject email without domain', () => {
      const control = new FormControl('ravi@');

      const result = CustomValidators.emailPattern()(control);

      expect(result?.['invalidEmail']).toBe(true);
    });

  });


  // ---------------------------------------
  // NO DOUBLE SPACES
  // ---------------------------------------

  describe('noDoubleSpaces', () => {

    it('should accept single spaces', () => {
      const control = new FormControl('Ravi Teja');

      const result = CustomValidators.noDoubleSpaces()(control);

      expect(result).toBeNull();
    });

    it('should reject double spaces', () => {
      const control = new FormControl('Ravi  Teja');

      const result = CustomValidators.noDoubleSpaces()(control);

      expect(result?.['doubleSpaces']).toBe(true);
    });

  });


  // ---------------------------------------
  // PASSWORD
  // ---------------------------------------

  describe('strongPassword', () => {

    it('should accept a strong password', () => {
      const control = new FormControl('Ravi@123');

      const result = CustomValidators.strongPassword()(control);

      expect(result).toBeNull();
    });

    it('should reject password without uppercase', () => {
      const control = new FormControl('ravi@123');

      const result = CustomValidators.strongPassword()(control);

      expect(result?.['weakPassword']).toBe(true);
    });

    it('should reject password without lowercase', () => {
      const control = new FormControl('RAVI@123');

      const result = CustomValidators.strongPassword()(control);

      expect(result?.['weakPassword']).toBe(true);
    });

    it('should reject password without number', () => {
      const control = new FormControl('Ravi@abc');

      const result = CustomValidators.strongPassword()(control);

      expect(result?.['weakPassword']).toBe(true);
    });

    it('should reject password without special character', () => {
      const control = new FormControl('Ravi123');

      const result = CustomValidators.strongPassword()(control);

      expect(result?.['weakPassword']).toBe(true);
    });

    it('should reject password shorter than 6 characters', () => {
      const control = new FormControl('Ra@1');

      const result = CustomValidators.strongPassword()(control);

      expect(result?.['weakPassword']).toBe(true);
    });

  });


  // ---------------------------------------
  // PHONE
  // ---------------------------------------

  describe('phoneValidator', () => {

    it('should accept valid Indian phone number', () => {
      const control = new FormControl('9876543210');

      const result = CustomValidators.phoneValidator()(control);

      expect(result).toBeNull();
    });

    it('should reject phone starting with 5', () => {
      const control = new FormControl('5876543210');

      const result = CustomValidators.phoneValidator()(control);

      expect(result?.['invalidPhoneStart']).toBe(true);
    });

    it('should reject phone starting with 1', () => {
      const control = new FormControl('1876543210');

      const result = CustomValidators.phoneValidator()(control);

      expect(result?.['invalidPhoneStart']).toBe(true);
    });

    it('should reject phone with less than 10 digits', () => {
      const control = new FormControl('987654321');

      const result = CustomValidators.phoneValidator()(control);

      expect(result?.['invalidPhoneLength']).toBe(true);
    });

    it('should reject phone with more than 10 digits', () => {
      const control = new FormControl('98765432101');

      const result = CustomValidators.phoneValidator()(control);

      expect(result?.['invalidPhoneLength']).toBe(true);
    });

    it('should reject alphabetic characters', () => {
      const control = new FormControl('98765abc10');

      const result = CustomValidators.phoneValidator()(control);

      expect(result?.['invalidPhoneLength']).toBe(true);
    });

    it('should allow empty value', () => {
      const control = new FormControl('');

      const result = CustomValidators.phoneValidator()(control);

      expect(result).toBeNull();
    });

  });


  // ---------------------------------------
  // ONLY NUMBER
  // ---------------------------------------

  describe('onlyNumber', () => {

    it('should accept numbers', () => {
      const control = new FormControl('123456');

      const result = CustomValidators.onlyNumber()(control);

      expect(result).toBeNull();
    });

    it('should reject alphabets', () => {
      const control = new FormControl('123abc');

      const result = CustomValidators.onlyNumber()(control);

      expect(result?.['invalidNumber']).toBe(true);
    });

    it('should reject special characters', () => {
      const control = new FormControl('123@456');

      const result = CustomValidators.onlyNumber()(control);

      expect(result?.['invalidNumber']).toBe(true);
    });

  });


  // ---------------------------------------
  // DIMENSIONS
  // ---------------------------------------

  describe('dimensions', () => {

    it('should accept valid dimensions', () => {
      const control = new FormControl('1920x1080');

      const result = CustomValidators.dimensions()(control);

      expect(result).toBeNull();
    });

    it('should reject invalid dimensions', () => {
      const control = new FormControl('1920-1080');

      const result = CustomValidators.dimensions()(control);

      expect(result?.['invalidDimensions']).toBe(true);
    });

    it('should reject dimensions with more than 4 digits', () => {
      const control = new FormControl('19200x1080');

      const result = CustomValidators.dimensions()(control);

      expect(result?.['invalidDimensions']).toBe(true);
    });

  });


  // ---------------------------------------
  // PAN
  // ---------------------------------------

  describe('panCardNumber', () => {

    it('should accept valid PAN format', () => {
      const control = new FormControl('ABCDE1234F');

      const result = CustomValidators.panCardNumber()(control);

      expect(result).toBeNull();
    });

    it('should reject invalid PAN', () => {
      const control = new FormControl('ABC1234');

      const result = CustomValidators.panCardNumber()(control);

      expect(result?.['panCardNumber']).toBe(true);
    });

  });


  // ---------------------------------------
  // GST
  // ---------------------------------------

  describe('gstNumber', () => {

    it('should accept valid GST format', () => {
      const control = new FormControl('29ABCDE1234F1Z5');

      const result = CustomValidators.gstNumber()(control);

      expect(result).toBeNull();
    });

    it('should reject invalid GST', () => {
      const control = new FormControl('INVALIDGST');

      const result = CustomValidators.gstNumber()(control);

      expect(result?.['invalidGST']).toBe(true);
    });

  });


  // ---------------------------------------
  // LICENSE NUMBER
  // ---------------------------------------

  describe('licenseNumber', () => {

    it('should accept valid license number', () => {
      const control = new FormControl('AP01/12345');

      const result = CustomValidators.licenseNumber()(control);

      expect(result).toBeNull();
    });

    it('should reject license without alphabet', () => {
      const control = new FormControl('12345/6789');

      const result = CustomValidators.licenseNumber()(control);

      expect(result?.['invalidLicense']).toBe(true);
    });

    it('should reject license without number', () => {
      const control = new FormControl('AP/ABC');

      const result = CustomValidators.licenseNumber()(control);

      expect(result?.['invalidLicense']).toBe(true);
    });

  });


  // ---------------------------------------
  // UPI
  // ---------------------------------------

  describe('upiid', () => {

    it('should accept valid UPI ID', () => {
      const control = new FormControl('ravi@upi');

      const result = CustomValidators.upiid()(control);

      expect(result).toBeNull();
    });

    it('should reject invalid UPI ID', () => {
      const control = new FormControl('ravi');

      const result = CustomValidators.upiid()(control);

      expect(result?.['upiid']).toBe(true);
    });

  });


  // ---------------------------------------
  // WEBSITE
  // ---------------------------------------

  describe('website', () => {

    it('should accept normal website', () => {
      const control = new FormControl('example.com');

      const result = CustomValidators.website()(control);

      expect(result).toBeNull();
    });

    it('should accept HTTPS website', () => {
      const control = new FormControl('https://example.com');

      const result = CustomValidators.website()(control);

      expect(result).toBeNull();
    });

    it('should reject invalid website', () => {
      const control = new FormControl('not a website');

      const result = CustomValidators.website()(control);

      expect(result?.['website']).toBe(true);
    });

  });

});