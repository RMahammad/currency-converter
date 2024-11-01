"use client";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import Image from "next/image";
import { useState } from "react";
import { ApiError, CurrencyOptions } from "../../../types";
import CustomSelect from "../form/CustomSelect";
import DebouncedInput from "../form/DebouncedInput";
import { ERROR_MESSAGES } from "@/constants";

const currencyOptions: CurrencyOptions[] = [
  { value: "EUR", label: "EUR", image: "/assets/flags/eur.svg" },
  { value: "GBP", label: "GBP", image: "/assets/flags/gbp.svg" },
  { value: "PLN", label: "PLN", image: "/assets/flags/pln.svg" },
  { value: "UAH", label: "UAH", image: "/assets/flags/uah.svg" },
];

const currencyLimits = {
  PLN: 20000,
  EUR: 5000,
  GBP: 1000,
  UAH: 50000,
};

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
    setConvertedAmount,
    currencyRate,
    isError,
    error,
    isLoading,
  } = useCurrencyConverter({
    defaultFrom: "EUR",
    defaultTo: "GBP",
    defaultAmount: 1.0,
    enabled: isConverted,
  });

  return (
    <div className="flex flex-col gap-5 w-[480px] px-5 py-10 shadow-3xl">
      <div className="flex items-end gap-3">
        <CustomSelect
          options={currencyOptions}
          value={fromCurrency}
          label={"From:"}
          onChange={setFromCurrency}
        />

        <Image
          src={"/assets/common/exchange.svg"}
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

        <CustomSelect
          options={currencyOptions}
          value={toCurrency}
          label={"To:"}
          onChange={setToCurrency}
        />
      </div>

      <div className="flex items-center gap-10">
        <DebouncedInput
          amountToSend={amountToSend}
          onChange={setAmountToSend}
          isLoading={isLoading}
          currency={fromCurrency}
          maxLimit={currencyLimits[fromCurrency]}
          label={"Amount:"}
        />

        {isConverted && (
          <DebouncedInput
            amountToSend={convertedAmount}
            onChange={setConvertedAmount}
            isLoading={isLoading}
            currency={toCurrency}
            label={"Converted to:"}
          />
        )}
      </div>

      {!isConverted && (
        <button
          onClick={() => {
            setIsConverted(true);
          }}
          className="w-full items-center justify-center bg-[#26d643] text-white py-2 mt-5"
        >
          Convert
        </button>
      )}

      {isError && (
        <p className="text-sm text-red-500 -mt-3">
          {error instanceof Error &&
          (error as ApiError).response &&
          (error as ApiError).response.data.error === "AMOUNT_TOO_LOW"
            ? ERROR_MESSAGES.AMOUNT_TOO_LOW
            : ERROR_MESSAGES.UNKNOWN_ERROR}
        </p>
      )}

      {isConverted && (
        <div className="mt-4">
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

      {/* We can use dialog or loading animation inside input depends on situation :) */}
      {/* {isLoading && <LoadingDialog />} */}
    </div>
  );
};
