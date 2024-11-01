"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRates } from "../services/apiService";
import { Currency, CurrencyRateResponse } from "../../types";

interface UseCurrencyConverterProps {
  defaultFrom: Currency;
  defaultTo: Currency;
  defaultAmount: number;
  enabled: boolean;
}

export const useCurrencyConverter = ({
  defaultFrom,
  defaultTo,
  defaultAmount,
  enabled,
}: UseCurrencyConverterProps) => {
  const [fromCurrency, setFromCurrency] = useState<Currency>(defaultFrom);
  const [toCurrency, setToCurrency] = useState<Currency>(defaultTo);
  const [amountToSend, setAmountToSend] = useState<number>(defaultAmount);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [currencyRate, setCurrencyRate] = useState<number | undefined>();
  const [isReversedConversion, setIsReversedConversion] = useState(false);

  const { data, isError, error, isSuccess, isLoading } = useQuery<CurrencyRateResponse>({
    queryKey: isReversedConversion
      ? ["rates", toCurrency, fromCurrency, convertedAmount]
      : ["rates", fromCurrency, toCurrency, amountToSend],
    queryFn: () =>
      isReversedConversion
        ? fetchRates(toCurrency, fromCurrency, convertedAmount || 0)
        : fetchRates(fromCurrency, toCurrency, amountToSend),
    enabled,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      if (isReversedConversion) {
        setAmountToSend(data.toAmount);
      } else {
        setConvertedAmount(data.toAmount);
        setCurrencyRate(data.rate);
      }
    }
  }, [isSuccess, data, isReversedConversion]);

  useEffect(() => {
    if (isError) {
      setConvertedAmount(0);
      setAmountToSend(0);
    }
  }, [isError]);

  const updateConvertedAmount = (newConvertedAmount: number) => {
    setIsReversedConversion(true);
    setConvertedAmount(newConvertedAmount);
  };

  const updateAmountToSend = (newAmountToSend: number) => {
    setIsReversedConversion(false);
    setAmountToSend(newAmountToSend);
  };

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amountToSend,
    setAmountToSend: updateAmountToSend,
    convertedAmount,
    setConvertedAmount: updateConvertedAmount,
    currencyRate,
    isSuccess,
    isError,
    error,
    isLoading,
  };
};
