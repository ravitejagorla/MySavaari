import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = sessionStorage.getItem('access_token');
  if (token) {
    return true;
  }
  return router.createUrlTree(['/auth/login']);
};