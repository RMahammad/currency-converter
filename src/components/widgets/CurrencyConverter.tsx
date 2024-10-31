"use client";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import Image from "next/image";
import { useState } from "react";
import { ApiError } from "../../../types";
import LoadingDialog from "../dialogs/LoadingDialog";
import CustomSelect from "../form/CustomSelect";
import DebouncedInput from "../form/DebouncedInput";

const currencyOptions = [
  { value: "EUR", label: "EUR", image: "/assets/flags/eur.svg" },
  { value: "GBP", label: "GBP", image: "/assets/flags/gbp.svg" },
  { value: "PLN", label: "PLN", image: "/assets/flags/pln.svg" },
  { value: "UAH", label: "UAH", image: "/assets/flags/uah.svg" },
];

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
    <div className="flex flex-col gap-5 w-[480px] px-5 py-10 shadow-sm">
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
          label={"From:"}
          onChange={setToCurrency}
        />
      </div>

      <div className="flex items-center gap-10">
        <DebouncedInput
          amountToSend={amountToSend}
          onChange={setAmountToSend}
          isLoading={isLoading}
          fromCurrency={fromCurrency}
        />

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
        <p className="text-red-500">
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

      {isLoading && <LoadingDialog />}
    </div>
  );
};