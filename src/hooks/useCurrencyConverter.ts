"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRates } from "../services/apiService"; // Ensure the path is correct

interface UseCurrencyConverterProps {
  defaultFrom: string;
  defaultTo: string;
  defaultAmount: number;
  enabled: boolean;
}

export const useCurrencyConverter = ({
  defaultFrom,
  defaultTo,
  defaultAmount,
  enabled,
}: UseCurrencyConverterProps) => {
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [amountToSend, setAmountToSend] = useState(defaultAmount);
  const [convertedAmount, setConvertedAmount] = useState<number | undefined>();
  const [currencyRate, setCurrencyRate] = useState<number | undefined>();

  const { data, isError, error, isSuccess, isLoading } = useQuery({
    queryKey: ["rates", fromCurrency, toCurrency, amountToSend],
    queryFn: () => fetchRates(fromCurrency, toCurrency, amountToSend),
    enabled,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data && data.toAmount !== undefined) {
      setConvertedAmount(data.toAmount);
      setCurrencyRate(data.rate);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      setConvertedAmount(0);
    }
  }, [isError]);

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amountToSend,
    setAmountToSend,
    convertedAmount,
    setConvertedAmount,
    currencyRate,
    isSuccess,
    isError,
    error,
    isLoading,
  };
};
