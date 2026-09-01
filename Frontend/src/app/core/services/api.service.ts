import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  // GET
  get(endpoint: string, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get(
      `${this.apiUrl}/${endpoint}`,
      {
        headers: this.getHeaders(),
        params: httpParams
      }
    );
  }

  // POST
  post(endpoint: string, data: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/${endpoint}`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // PUT
  put(endpoint: string, data: any): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${endpoint}`,
      data,
      {
        headers: this.getHeaders()
      }
    );
  }

  // DELETE
  delete(endpoint: string, data?: any): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${endpoint}`,
      {
        headers: this.getHeaders(),
        body: data
      }
    );
  }
}