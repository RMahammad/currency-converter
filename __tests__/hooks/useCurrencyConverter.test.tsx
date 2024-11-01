import { renderHook, act, waitFor } from "@testing-library/react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchRates } from "@/services/apiService";

jest.mock("@/services/apiService");

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useCurrencyConverter Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(
      () =>
        useCurrencyConverter({
          defaultFrom: "EUR",
          defaultTo: "GBP",
          defaultAmount: 1,
          enabled: false,
        }),
      { wrapper }
    );

    expect(result.current.fromCurrency).toBe("EUR");
    expect(result.current.toCurrency).toBe("GBP");
    expect(result.current.amountToSend).toBe(1);
    expect(result.current.convertedAmount).toBe(0);
    expect(result.current.currencyRate).toBeUndefined();
  });

  it("should fetch rates and update converted amount and currency rate on success", async () => {
    (fetchRates as jest.Mock).mockResolvedValue({
      toAmount: 0.85,
      rate: 0.85,
    });

    const { result } = renderHook(
      () =>
        useCurrencyConverter({
          defaultFrom: "EUR",
          defaultTo: "GBP",
          defaultAmount: 1,
          enabled: true,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.convertedAmount).toBe(0.85);
    expect(result.current.currencyRate).toBe(0.85);
  });

  it("should reset converted and sent amounts on error", async () => {
    (fetchRates as jest.Mock).mockRejectedValue(new Error("API error"));

    const { result } = renderHook(
      () =>
        useCurrencyConverter({
          defaultFrom: "EUR",
          defaultTo: "GBP",
          defaultAmount: 1,
          enabled: true,
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.convertedAmount).toBe(0);
    expect(result.current.amountToSend).toBe(0);
  });

  it("should swap currencies correctly", () => {
    const { result } = renderHook(
      () =>
        useCurrencyConverter({
          defaultFrom: "EUR",
          defaultTo: "GBP",
          defaultAmount: 1,
          enabled: false,
        }),
      { wrapper }
    );

    act(() => {
      result.current.setFromCurrency("GBP");
      result.current.setToCurrency("EUR");
    });

    expect(result.current.fromCurrency).toBe("GBP");
    expect(result.current.toCurrency).toBe("EUR");
  });

  it("should update amountToSend and set conversion direction correctly", () => {
    const { result } = renderHook(
      () =>
        useCurrencyConverter({
          defaultFrom: "EUR",
          defaultTo: "GBP",
          defaultAmount: 1,
          enabled: false,
        }),
      { wrapper }
    );

    act(() => {
      result.current.setAmountToSend(100);
    });

    expect(result.current.amountToSend).toBe(100);

    act(() => {
      result.current.setConvertedAmount(85);
    });

    expect(result.current.convertedAmount).toBe(85);
  });
});
