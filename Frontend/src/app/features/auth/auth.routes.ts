import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.Register) },
  { path: 'email-verify', loadComponent: () => import('./otp-pages/email-otp/email-otp').then(m => m.EmailOtp) },
  { path: 'phone-verify', loadComponent: () => import('./otp-pages/sms-otp/sms-otp').then(m => m.SmsOtp) },
];