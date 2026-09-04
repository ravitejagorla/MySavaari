import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('../../features/auth/login/login').then(m => m.Login) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('../../features/auth/register/register').then(m => m.Register) },
  { path: 'email-verify', loadComponent: () => import('../../features/auth/otp-pages/email-otp/email-otp').then(m => m.EmailOtp) },
  { path: 'phone-verify', loadComponent: () => import('../../features/auth/otp-pages/sms-otp/sms-otp').then(m => m.SmsOtp) },
];