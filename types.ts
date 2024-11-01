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

export const allowedCurrencies = ["PLN", "EUR", "GBP", "UAH"] as const;

export type Currency = (typeof allowedCurrencies)[number];

export interface CurrencyOptions {
  value: Currency;
  label: string;
  image: string;
}

export interface ApiError extends Error {
  response: {
    data: {
      error: string;
    };
    status: number;
  };
}
