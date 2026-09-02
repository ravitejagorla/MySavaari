import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private router: Router) {}
  logout(): void {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }
}
