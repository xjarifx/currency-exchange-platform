import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="public-page">
      <div class="hero">
        <h1>Currency Exchange Platform</h1>
        <p class="subtitle">Real-time currency conversion at your fingertips</p>
        <p class="description">
          Convert between multiple currencies with live exchange rates.
          Our platform provides accurate and up-to-date conversion rates
          powered by reliable external data sources.
        </p>
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">💱</div>
            <h3>Live Rates</h3>
            <p>Real-time exchange rates updated every 30 minutes</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>30+ Currencies</h3>
            <p>Support for major world currencies</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>JWT-based authentication for secure access</p>
          </div>
        </div>
        <div class="cta">
          <a routerLink="/login" class="btn-primary">Get Started</a>
        </div>
        <div class="credentials-info">
          <h4>Sample Credentials</h4>
          <div class="credential-row">
            <span class="label">Admin:</span> <code>admin / admin123</code>
          </div>
          <div class="credential-row">
            <span class="label">User:</span> <code>user / user123</code>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .public-page {
      min-height: calc(100vh - 60px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    }
    .hero {
      text-align: center;
      max-width: 800px;
      padding: 3rem 2rem;
    }
    h1 {
      font-size: 2.5rem;
      color: #1a237e;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 1.25rem;
      color: #5c6bc0;
      margin-bottom: 1.5rem;
    }
    .description {
      color: #424242;
      line-height: 1.7;
      margin-bottom: 2.5rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .feature-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .feature-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }
    .feature-card h3 {
      margin: 0 0 0.5rem;
      color: #1a237e;
      font-size: 1.1rem;
    }
    .feature-card p {
      margin: 0;
      color: #616161;
      font-size: 0.9rem;
    }
    .cta {
      margin-bottom: 2rem;
    }
    .btn-primary {
      display: inline-block;
      background: #1a237e;
      color: white;
      padding: 0.85rem 2.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-size: 1.1rem;
      font-weight: 600;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #283593;
    }
    .credentials-info {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      display: inline-block;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .credentials-info h4 {
      margin: 0 0 1rem;
      color: #1a237e;
    }
    .credential-row {
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    .credential-row .label {
      font-weight: 600;
      margin-right: 0.5rem;
    }
    code {
      background: #e8eaf6;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-family: monospace;
    }
    @media (max-width: 768px) {
      .hero {
        padding: 2rem 1rem;
      }
      h1 {
        font-size: 1.75rem;
      }
      .subtitle {
        font-size: 1.05rem;
      }
      .features {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .credentials-info {
        display: block;
        width: 100%;
      }
    }
  `]
})
export class PublicComponent {}
