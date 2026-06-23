import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginRequest, LoginResponse, UserInfo, ApiResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5059/api/auth';
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  currentUser = signal<UserInfo | null>(this.loadUser());
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            localStorage.setItem(this.tokenKey, response.data.token);
            this.fetchCurrentUser();
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  fetchCurrentUser(): void {
    const token = this.getToken();
    if (!token) {
      this.currentUser.set(null);
      return;
    }

    this.http.get<ApiResponse<UserInfo>>(`${this.apiUrl}/me`)
      .pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      )
      .subscribe(response => {
        if (response?.success && response.data) {
          this.currentUser.set(response.data);
          localStorage.setItem(this.userKey, JSON.stringify(response.data));
        } else {
          this.logout();
        }
      });
  }

  private loadUser(): UserInfo | null {
    const stored = localStorage.getItem(this.userKey);
    if (stored && this.getToken()) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }
}
