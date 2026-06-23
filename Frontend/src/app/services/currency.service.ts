import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Currency, ConversionRequest, ConversionResponse } from '../models/currency.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private readonly apiUrl = 'http://localhost:5059/api/currency';

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<ApiResponse<Currency[]>> {
    return this.http.get<ApiResponse<Currency[]>>(`${this.apiUrl}/currencies`);
  }

  convert(request: ConversionRequest): Observable<ApiResponse<ConversionResponse>> {
    return this.http.post<ApiResponse<ConversionResponse>>(`${this.apiUrl}/convert`, request);
  }
}
