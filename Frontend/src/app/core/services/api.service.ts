import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root', })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  get(endpoint: string, params?: Record<string, string | number | boolean>): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        httpParams = httpParams.set(key, String(value));
      });
    }

    return this.http.get(`${this.apiUrl}/${endpoint}`, {
      params: httpParams,
    });
  }

  post(endpoint: string, data: unknown): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  put(endpoint: string, data: unknown): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, data);
  }

  patch(endpoint: string, data: unknown): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${endpoint}`, data);
  }

  delete(endpoint: string, data?: unknown): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, {
      body: data,
    });
  }
}