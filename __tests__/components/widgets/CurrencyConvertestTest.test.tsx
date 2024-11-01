import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { CurrencyConverter } from "@/components/widgets/CurrencyConverter";
import { ApiError } from "../../../types";

jest.mock("@/hooks/useCurrencyConverter");

describe("CurrencyConverter Component", () => {
  beforeEach(() => {
    (useCurrencyConverter as jest.Mock).mockReturnValue({
      fromCurrency: "EUR",
      setFromCurrency: jest.fn(),
      toCurrency: "GBP",
      setToCurrency: jest.fn(),
      amountToSend: 1,
      setAmountToSend: jest.fn(),
      convertedAmount: 0.85,
      setConvertedAmount: jest.fn(),
      currencyRate: 0.85,
      isError: false,
      error: null,
      isLoading: false,
    });
  });

  it("renders correctly with initial values", () => {
    render(<CurrencyConverter />);

    expect(screen.getByText("From:")).toBeInTheDocument();
    expect(screen.getByText("To:")).toBeInTheDocument();

    expect(screen.getAllByText("EUR")[0]).toBeInTheDocument();
    expect(screen.getAllByText("GBP")[0]).toBeInTheDocument();

    expect(screen.getByLabelText("Amount:")).toHaveValue(1);
    expect(
      screen.getByRole("button", { name: /Convert/i })
    ).toBeInTheDocument();
  });

  it("swaps currencies when exchange icon is clicked", () => {
    const setFromCurrencyMock = jest.fn();
    const setToCurrencyMock = jest.fn();
    const setAmountToSendMock = jest.fn();

    (useCurrencyConverter as jest.Mock).mockReturnValue({
      fromCurrency: "EUR",
      setFromCurrency: setFromCurrencyMock,
      toCurrency: "GBP",
      setToCurrency: setToCurrencyMock,
      amountToSend: 1,
      setAmountToSend: setAmountToSendMock,
      convertedAmount: 0.85,
      setConvertedAmount: jest.fn(),
      currencyRate: 0.85,
      isError: false,
      error: null,
      isLoading: false,
    });

    render(<CurrencyConverter />);

    fireEvent.click(screen.getByAltText("exchange"));

    expect(setFromCurrencyMock).toHaveBeenCalledWith("GBP");
    expect(setToCurrencyMock).toHaveBeenCalledWith("EUR");
    expect(setAmountToSendMock).toHaveBeenCalledWith(0.85);
  });

  it("displays converted amount input when converted", () => {
    render(<CurrencyConverter />);
    fireEvent.click(screen.getByRole("button", { name: /Convert/i }));

    expect(screen.getByLabelText("Converted to:")).toBeInTheDocument();
  });

  it("shows an error message when an error occurs", () => {
    const mockError = new Error("Conversion error") as ApiError;
    mockError.response = { data: { error: "Conversion error" }, status: 404 };

    (useCurrencyConverter as jest.Mock).mockReturnValue({
      fromCurrency: "EUR",
      setFromCurrency: jest.fn(),
      toCurrency: "GBP",
      setToCurrency: jest.fn(),
      amountToSend: 1,
      setAmountToSend: jest.fn(),
      convertedAmount: 0.85,
      setConvertedAmount: jest.fn(),
      currencyRate: 0.85,
      isError: true,
      error: mockError,
      isLoading: false,
    });

    render(<CurrencyConverter />);

    expect(screen.getByText(/Error:/)).toHaveTextContent(
      "Error: Conversion error"
    );
  });

  it("displays loading dialog when loading", () => {
    (useCurrencyConverter as jest.Mock).mockReturnValue({
      fromCurrency: "EUR",
      setFromCurrency: jest.fn(),
      toCurrency: "GBP",
      setToCurrency: jest.fn(),
      amountToSend: 1,
      setAmountToSend: jest.fn(),
      convertedAmount: 0.85,
      setConvertedAmount: jest.fn(),
      currencyRate: 0.85,
      isError: false,
      error: null,
      isLoading: true,
    });

    render(<CurrencyConverter />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays exchange rate after conversion", async () => {
    render(<CurrencyConverter />);
    fireEvent.click(screen.getByRole("button", { name: /Convert/i }));

    await waitFor(() => {
      expect(screen.getByText("1 EUR = 0.85 GBP")).toBeInTheDocument();
    });
  });
});
