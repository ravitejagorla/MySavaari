import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html'
})
export class Home implements OnInit {

  private apiService = inject(ApiService);

  message = '';
  status = '';

  ngOnInit(): void {
    this.apiService.getHome().subscribe({
      next: (response) => {
        this.message = response.message;
        this.status = response.status;
        console.log('Backend response:', response);
      },
      error: (error) => {
        console.error('Backend connection failed:', error);
      }
    });
  }
}