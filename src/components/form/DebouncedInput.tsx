import { useState, useEffect, ChangeEvent, FC, KeyboardEvent } from "react";

interface DebouncedInputProps {
  onChange: (value: number) => void;
  amountToSend: number;
  isLoading: boolean;
  fromCurrency: string;
  debounce?: number;
}

const DebouncedInput: FC<DebouncedInputProps> = ({
  onChange,
  amountToSend,
  isLoading,
  fromCurrency,
  debounce = 500,
}) => {
  const [value, setValue] = useState<number>(amountToSend);

  useEffect(() => {
    setValue(amountToSend);
  }, [amountToSend]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(handler);
  }, [value, onChange, debounce]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  return (
    <div className="input-container flex items-center border-b w-full">
      <input
        value={value}
        type="number"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="outline-none w-full font-bold"
        disabled={isLoading}
      />
      <span className="pl-2 text-gray-500">{fromCurrency}</span>
    </div>
  );
};

export default DebouncedInput;
