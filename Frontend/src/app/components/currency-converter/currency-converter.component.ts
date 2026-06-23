import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { Currency, ConversionResponse } from '../../models/currency.model';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="converter-page">
      <h1>Currency Converter</h1>
      <p class="page-subtitle">Convert between currencies using live exchange rates</p>

      <div class="converter-card">
        <form [formGroup]="converterForm" (ngSubmit)="onConvert()">
          <div class="form-row">
            <div class="form-group">
              <label for="sourceCurrency">From</label>
              <select id="sourceCurrency" formControlName="sourceCurrency">
                <option value="">Select currency</option>
                @for (currency of currencies(); track currency.code) {
                  <option [value]="currency.code">{{ currency.code }} - {{ currency.name }}</option>
                }
              </select>
            </div>

            <div class="swap-icon" (click)="swapCurrencies()">⇄</div>

            <div class="form-group">
              <label for="targetCurrency">To</label>
              <select id="targetCurrency" formControlName="targetCurrency">
                <option value="">Select currency</option>
                @for (currency of currencies(); track currency.code) {
                  <option [value]="currency.code">{{ currency.code }} - {{ currency.name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="amount">Amount</label>
            <input
              id="amount"
              type="number"
              formControlName="amount"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
            />
          </div>

          @if (errorMessage()) {
            <div class="alert alert-error">{{ errorMessage() }}</div>
          }

          <button type="submit" class="btn-convert" [disabled]="isLoading() || converterForm.invalid">
            {{ isLoading() ? 'Converting...' : 'Convert' }}
          </button>
        </form>

        @if (result()) {
          <div class="result-section">
            <h3>Result</h3>
            <div class="result-display">
              <div class="result-amount">
                {{ result()!.amount | number:'1.2-2' }} {{ result()!.sourceCurrency }}
              </div>
              <div class="result-equals">=</div>
              <div class="result-converted">
                {{ result()!.convertedAmount | number:'1.2-2' }} {{ result()!.targetCurrency }}
              </div>
            </div>
            <div class="result-details">
              <div class="detail-item">
                <span class="label">Exchange Rate:</span>
                <span>1 {{ result()!.sourceCurrency }} = {{ result()!.rate | number:'1.4-6' }} {{ result()!.targetCurrency }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Updated:</span>
                <span>{{ result()!.timestamp | date:'medium' }}</span>
              </div>
            </div>
          </div>
        }
      </div>

      @if (isLoadingCurrencies()) {
        <div class="loading">Loading currencies...</div>
      }
    </div>
  `,
  styles: [`
    .converter-page {
      max-width: 700px;
      margin: 0 auto;
    }
    h1 {
      color: #1a237e;
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      color: #616161;
      margin-bottom: 2rem;
    }
    .converter-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }
    .form-row {
      display: flex;
      align-items: end;
      gap: 1rem;
    }
    .form-row .form-group {
      flex: 1;
    }
    .swap-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e8eaf6;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .swap-icon:hover {
      background: #c5cae9;
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
    select, input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      background: white;
    }
    select:focus, input:focus {
      outline: none;
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }
    .alert-error {
      background: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .btn-convert {
      width: 100%;
      padding: 0.85rem;
      background: #1a237e;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.05rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-convert:hover:not(:disabled) {
      background: #283593;
    }
    .btn-convert:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .result-section {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid #e8eaf6;
    }
    .result-section h3 {
      margin: 0 0 1rem;
      color: #1a237e;
    }
    .result-display {
      text-align: center;
      padding: 1.5rem;
      background: #f5f5f5;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    .result-amount {
      font-size: 1.25rem;
      color: #424242;
    }
    .result-equals {
      font-size: 1.5rem;
      color: #1a237e;
      margin: 0.5rem 0;
      font-weight: 700;
    }
    .result-converted {
      font-size: 1.75rem;
      color: #1a237e;
      font-weight: 700;
    }
    .result-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #616161;
    }
    .detail-item .label {
      font-weight: 600;
      color: #333;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      color: #616161;
    }
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .swap-icon {
        margin: 0.5rem auto;
      }
      .converter-card {
        padding: 1.25rem;
      }
      .result-display {
        padding: 1rem;
      }
      .result-converted {
        font-size: 1.35rem;
      }
    }
  `]
})
export class CurrencyConverterComponent implements OnInit {
  converterForm: FormGroup;
  currencies = signal<Currency[]>([]);
  result = signal<ConversionResponse | null>(null);
  isLoading = signal(false);
  isLoadingCurrencies = signal(true);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService
  ) {
    this.converterForm = this.fb.group({
      sourceCurrency: ['', Validators.required],
      targetCurrency: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
  }

  loadCurrencies(): void {
    this.isLoadingCurrencies.set(true);
    this.currencyService.getCurrencies().subscribe({
      next: (response) => {
        this.isLoadingCurrencies.set(false);
        if (response.success && response.data) {
          this.currencies.set(response.data);
        }
      },
      error: () => {
        this.isLoadingCurrencies.set(false);
        this.errorMessage.set('Failed to load currencies');
      }
    });
  }

  onConvert(): void {
    if (this.converterForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.result.set(null);

    this.currencyService.convert(this.converterForm.value).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.result.set(response.data);
        } else {
          this.errorMessage.set(response.message || 'Conversion failed');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Conversion failed. Please try again.');
      }
    });
  }

  swapCurrencies(): void {
    const form = this.converterForm;
    const source = form.get('sourceCurrency')?.value;
    const target = form.get('targetCurrency')?.value;
    form.patchValue({ sourceCurrency: target, targetCurrency: source });
  }
}
