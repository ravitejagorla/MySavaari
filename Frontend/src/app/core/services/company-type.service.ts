import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CompanyType } from '../models/datamanagement/company-type.model';

@Injectable({ providedIn: 'root' })
export class CompanyTypeService {
  private readonly apiService = inject(ApiService);
  getCompanyTypes(): Observable<CompanyType[]> {
    return this.apiService.get('datamanagement/company-types/');
  }
}