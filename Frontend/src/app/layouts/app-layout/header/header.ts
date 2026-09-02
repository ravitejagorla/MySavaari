import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [],
  selector: 'ras-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(private authService: AuthService) { }
  
    logout(): void {
      this.authService.logout();
    }
}
