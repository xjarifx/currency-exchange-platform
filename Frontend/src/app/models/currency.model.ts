export interface Currency {
  code: string;
  name: string;
}

export interface ConversionRequest {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
}

export interface ConversionResponse {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: string;
}
