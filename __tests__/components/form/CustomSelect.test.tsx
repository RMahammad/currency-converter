import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Currency, CurrencyOptions } from "../../../types";
import CustomSelect from "@/components/form/CustomSelect";

const currencyOptions: CurrencyOptions[] = [
  { value: "EUR", label: "EUR", image: "/assets/flags/eur.svg" },
  { value: "GBP", label: "GBP", image: "/assets/flags/gbp.svg" },
  { value: "PLN", label: "PLN", image: "/assets/flags/pln.svg" },
  { value: "UAH", label: "UAH", image: "/assets/flags/uah.svg" },
];

describe("CustomSelect Component", () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing and displays the label", () => {
    render(
      <CustomSelect
        options={currencyOptions}
        value="EUR"
        label="Select Currency"
        onChange={onChange}
      />
    );

    expect(screen.getByText("Select Currency")).toBeInTheDocument();
  });

  it("displays the selected option correctly", () => {
    render(
      <CustomSelect
        options={currencyOptions}
        value="EUR"
        label="Select Currency"
        onChange={onChange}
      />
    );

    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByAltText("EUR")).toBeInTheDocument();
  });

  it("toggles options dropdown when clicked", () => {
    render(
      <CustomSelect
        options={currencyOptions}
        value="EUR"
        label="Select Currency"
        onChange={onChange}
      />
    );

    expect(screen.queryByText("GBP")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText("EUR")[0]);
    expect(screen.getByText("GBP")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("EUR")[0]);
    expect(screen.queryByText("GBP")).not.toBeInTheDocument();
  });

  it("calls onChange with the correct value when an option is selected", () => {
    render(
      <CustomSelect
        options={currencyOptions}
        value="EUR"
        label="Select Currency"
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByText("EUR"));
    fireEvent.click(screen.getByText("GBP"));

    expect(onChange).toHaveBeenCalledWith("GBP");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("closes the dropdown when clicking outside", () => {
    const { container } = render(
      <CustomSelect
        options={currencyOptions}
        value="EUR"
        label="Select Currency"
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByText("EUR"));
    expect(screen.getByText("GBP")).toBeInTheDocument();

    fireEvent.mouseDown(container);

    expect(screen.queryByText("GBP")).not.toBeInTheDocument();
  });

  it("renders default placeholder when no option is selected", () => {
    render(
      <CustomSelect
        options={currencyOptions}
        value={null as unknown as Currency}
        label="Select Currency"
        onChange={onChange}
      />
    );

    expect(screen.getByText("Select Currency")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Expand/i })).toBeInTheDocument();
  });
});
