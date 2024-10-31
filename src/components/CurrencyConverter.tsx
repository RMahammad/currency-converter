"use client";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import Image from "next/image";
import { useState } from "react";
import { ApiError } from "../../types";

export const CurrencyConverter = () => {
  const [isConverted, setIsConverted] = useState<boolean>(false);

  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amountToSend,
    setAmountToSend,
    convertedAmount,
    currencyRate,
    isError,
    error,
  } = useCurrencyConverter({
    defaultFrom: "EUR",
    defaultTo: "GBP",
    defaultAmount: 1.0,
    enabled: isConverted,
  });

  console.log("This is error: ", error);

  return (
    <div className="flex flex-col gap-5 min-w-80 max-w-md px-5 md:px-0">
      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="fromCurrency" className="text-xs text-gray-500">
            From:
          </label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="border-b outline-none"
          >
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
            <option value="PLN">🇵🇱 PLN</option>
            <option value="UAH">🇺🇦 UAH</option>
          </select>
        </div>

        <Image
          src={"/assets/exchange/exchange.svg"}
          width={20}
          height={20}
          alt="exchange"
          className="cursor-pointer"
          onClick={() => {
            setToCurrency(fromCurrency);
            setFromCurrency(toCurrency);
            setAmountToSend(Number(convertedAmount));
          }}
        />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="fromCurrency" className="text-xs text-gray-500">
            To:
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="border-b outline-none"
          >
            <option value="EUR" className="">
              🇪🇺 EUR
            </option>
            <option value="GBP">🇬🇧 GBP</option>
            <option value="PLN">🇵🇱 PLN</option>
            <option value="UAH">🇺🇦 UAH</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-10">
        <div className="input-container flex items-center border-b w-full">
          <input
            value={amountToSend}
            type="number"
            onChange={(e) => setAmountToSend(parseFloat(e.target.value))}
            className="outline-none w-full font-bold"
          />
          <span className="pl-2 text-gray-500">{fromCurrency}</span>
        </div>

        {isConverted && (
          <div className="input-container flex items-center border-b w-full">
            <input
              value={convertedAmount}
              type="number"
              onChange={() => {}}
              className="outline-none w-full font-bold"
            />
            <span className="pl-2 text-gray-500">{toCurrency}</span>
          </div>
        )}
      </div>

      {!isConverted && (
        <button
          onClick={() => {
            setIsConverted(true);
          }}
          className="w-full items-center justify-center bg-[#26d643] text-white py-2"
        >
          Convert
        </button>
      )}

      {isError && (
        <p>
          Error:{" "}
          {error instanceof Error && (error as ApiError).response
            ? (error as ApiError).response.data.error
            : "Unknown error"}
        </p>
      )}

      {isConverted && (
        <div>
          <p className="font-semibold">
            1 {fromCurrency} = {currencyRate} {toCurrency}
          </p>
          <p className="text-gray-400 text-xs">
            All figures are live mid-market rates, which are for informational
            purpose only. To see the rates for money transfer, please select
            sending money option
          </p>
        </div>
      )}
    </div>
  );
};
