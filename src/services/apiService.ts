import axios from "axios";
import { CurrencyRateResponse } from "../../types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetchRates = async (
  from: string,
  to: string,
  amount: number
): Promise<CurrencyRateResponse> => {
  const response = await apiClient.get<CurrencyRateResponse>("/fx-rates", {
    params: { from, to, amount },
  });

  return response.data;
};
