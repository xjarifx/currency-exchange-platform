import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h2>Sign In</h2>
        <p class="login-subtitle">Access your currency exchange dashboard</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Enter your username"
              [class.error]="loginForm.get('username')?.touched && loginForm.get('username')?.invalid"
            />
            @if (loginForm.get('username')?.touched && loginForm.get('username')?.errors) {
              <span class="error-text">Username is required</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter your password"
              [class.error]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
            />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.errors) {
              <span class="error-text">Password is required</span>
            }
          </div>

          @if (errorMessage()) {
            <div class="alert alert-error">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-submit" [disabled]="isLoading()">
            {{ isLoading() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="login-footer">
          <a routerLink="/">Back to Home</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: calc(100vh - 60px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    }
    .login-card {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 420px;
    }
    h2 {
      margin: 0 0 0.25rem;
      color: #1a237e;
      text-align: center;
    }
    .login-subtitle {
      text-align: center;
      color: #616161;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }
    input.error {
      border-color: #e53935;
    }
    .error-text {
      color: #e53935;
      font-size: 0.8rem;
      margin-top: 0.3rem;
      display: block;
    }
    .alert-error {
      background: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      text-align: center;
    }
    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: #1a237e;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-submit:hover:not(:disabled) {
      background: #283593;
    }
    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
    }
    .login-footer a {
      color: #5c6bc0;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .login-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'Login failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Invalid credentials';
        this.errorMessage.set(msg);
      }
    });
  }
}
