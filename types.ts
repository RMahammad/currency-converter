export interface CurrencyRateResponse {
  from: string;
  to: string;
  toAmount: number;
  fromAmount: number;
  rate: number;
}

export interface CurrencyConverterProps {
  defaultFrom: string;
  defaultTo: string;
  defaultAmount: number;
}

export interface ApiError extends Error {
  response: {
    data: {
      error: string;
    };
    status: number;
  };
}
