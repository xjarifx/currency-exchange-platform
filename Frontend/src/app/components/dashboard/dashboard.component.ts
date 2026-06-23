import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <h1>Welcome, {{ auth.currentUser()?.username }}!</h1>
        <p>You are signed in as <strong>{{ auth.currentUser()?.role }}</strong></p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Account Info</h3>
          <div class="stat-detail">
            <span class="label">Username:</span>
            <span>{{ auth.currentUser()?.username }}</span>
          </div>
          <div class="stat-detail">
            <span class="label">Email:</span>
            <span>{{ auth.currentUser()?.email }}</span>
          </div>
          <div class="stat-detail">
            <span class="label">Role:</span>
            <span class="role-badge">{{ auth.currentUser()?.role }}</span>
          </div>
        </div>

        <div class="stat-card">
          <h3>Quick Convert</h3>
          <p>Navigate to the Currency Converter to perform real-time conversions between 30+ world currencies.</p>
          <a routerLink="/converter" class="btn-link">Go to Converter →</a>
        </div>

        <div class="stat-card">
          <h3>Session Info</h3>
          <div class="stat-detail">
            <span class="label">Status:</span>
            <span class="status-active">Active</span>
          </div>
          <div class="stat-detail">
            <span class="label">Logged in:</span>
            <span>{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem 0;
    }
    .welcome-section {
      margin-bottom: 2rem;
    }
    .welcome-section h1 {
      margin: 0 0 0.5rem;
      color: #1a237e;
    }
    .welcome-section p {
      margin: 0;
      color: #616161;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .stat-card h3 {
      margin: 0 0 1rem;
      color: #1a237e;
      font-size: 1.1rem;
    }
    .stat-card p {
      color: #616161;
      line-height: 1.6;
    }
    .stat-detail {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .stat-detail:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      color: #333;
    }
    .role-badge {
      background: #e8eaf6;
      color: #1a237e;
      padding: 0.15rem 0.6rem;
      border-radius: 12px;
      font-size: 0.85rem;
    }
    .status-active {
      color: #2e7d32;
      font-weight: 600;
    }
    .btn-link {
      display: inline-block;
      margin-top: 1rem;
      color: #3f51b5;
      text-decoration: none;
      font-weight: 600;
    }
    .btn-link:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .welcome-section h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentTime = '';

  constructor(
    public auth: AuthService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currentTime = new Date().toLocaleString();
    this.auth.fetchCurrentUser();
  }
}
