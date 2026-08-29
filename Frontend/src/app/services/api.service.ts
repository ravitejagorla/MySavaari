import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface HomeResponse {
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://127.0.0.1:8000/api/accounts/';

  getHome(): Observable<HomeResponse> {
    return this.http.get<HomeResponse>(this.apiUrl);
  }
}