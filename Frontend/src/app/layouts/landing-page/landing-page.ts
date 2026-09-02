import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  imports: [],
  selector: 'ras-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
}
