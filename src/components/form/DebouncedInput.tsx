import {
  useState,
  useEffect,
  ChangeEvent,
  FC,
  KeyboardEvent,
  useRef,
} from "react";
import { Currency } from "../../../types";

interface DebouncedInputProps {
  onChange: (value: number) => void;
  amountToSend: number;
  isLoading: boolean;
  currency: Currency;
  debounce?: number;
  maxLimit?: number;
}

const DebouncedInput: FC<DebouncedInputProps> = ({
  onChange,
  amountToSend,
  isLoading,
  currency,
  debounce = 600,
  maxLimit,
}) => {
  const [value, setValue] = useState<number>(amountToSend);
  const [userEditing, setUserEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserEditing(true);
    const newNumber = parseFloat(e.target.value);

    if (maxLimit && newNumber > maxLimit) {
      setValue(maxLimit);
      setError("You exceed limit");
    } else {
      setValue(newNumber);
      setError(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  useEffect(() => {
    if (!userEditing) {
      setValue(amountToSend);
    }
  }, [amountToSend, userEditing]);

  useEffect(() => {
    if (maxLimit && amountToSend > maxLimit) {
      setValue(maxLimit);
      setError("You exceed limit");
      onChange(maxLimit);
    } else {
      setValue(amountToSend);
      setError(null);
    }
  }, [currency]);

  useEffect(() => {
    if (userEditing) {
      const handler = setTimeout(() => {
        onChange(value);
        setUserEditing(false);
      }, debounce);

      return () => clearTimeout(handler);
    }
  }, [value, onChange, debounce, userEditing]);

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <div className="input-container flex items-center border-b w-full">
        <input
          ref={inputRef}
          value={value}
          type="number"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="outline-none w-full font-bold"
          disabled={isLoading}
        />
        <span className="pl-2 text-gray-500">{currency}</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 absolute -bottom-6 min-w-64">
          {error}. Max limit: {maxLimit} {currency}
        </p>
      )}
    </div>
  );
};

export default DebouncedInput;
