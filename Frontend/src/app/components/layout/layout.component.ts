import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    @if (auth.isAuthenticated()) {
    <nav class="navbar">
      <div class="nav-brand">Currency Exchange</div>
      <div class="nav-links">
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/converter">Converter</a>
        <span class="nav-user">{{ auth.currentUser()?.username }}</span>
        <button class="btn-logout" (click)="auth.logout()">Logout</button>
      </div>
    </nav>
    <main class="container">
      <router-outlet />
    </main>
    }
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      height: 60px;
      background: #1a237e;
      color: white;
    }
    .nav-brand {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      font-size: 0.95rem;
    }
    .nav-links a:hover {
      text-decoration: underline;
    }
    .nav-user {
      font-size: 0.85rem;
      opacity: 0.8;
    }
    .btn-logout {
      background: transparent;
      color: white;
      border: 1px solid rgba(255,255,255,0.5);
      padding: 0.35rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .btn-logout:hover {
      background: rgba(255,255,255,0.15);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
  `]
})
export class LayoutComponent {
  constructor(public auth: AuthService) {}
}
