import {
  useState,
  useEffect,
  ChangeEvent,
  FC,
  KeyboardEvent,
  useRef,
} from "react";
import { Currency } from "../../../types";
import { ERROR_MESSAGES } from "@/constants";

interface DebouncedInputProps {
  onChange: (value: number) => void;
  amountToSend: number;
  isLoading: boolean;
  currency: Currency;
  debounce?: number;
  maxLimit?: number;
  label: string;
}

const DebouncedInput: FC<DebouncedInputProps> = ({
  onChange,
  amountToSend,
  isLoading,
  currency,
  debounce = 1000,
  maxLimit,
  label,
}) => {
  const [value, setValue] = useState<number>(amountToSend);
  const [userEditing, setUserEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserEditing(true);
    setIsTyping(true);
    const newNumber = parseFloat(e.target.value);

    if (isNaN(newNumber)) {
      setIsTyping(false);
    }

    if (maxLimit && newNumber > maxLimit) {
      setValue(maxLimit);
      setError(ERROR_MESSAGES.MAX_LIMIT + `${maxLimit} ${currency}`);
    } else {
      setValue(newNumber);
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
    setIsTyping(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (maxLimit && amountToSend > maxLimit) {
      setValue(maxLimit);
      setError(ERROR_MESSAGES.MAX_LIMIT + `${maxLimit} ${currency}`);
      onChange(maxLimit);
    } else {
      setValue(amountToSend);
      setError(null);
    }
  }, [currency]);

  useEffect(() => {
    if (isNaN(value)) {
      setError(ERROR_MESSAGES.VALID_AMOUNT);
    }

    if (userEditing && !isNaN(value)) {
      setError(null);

      const handler = setTimeout(() => {
        onChange(value);
        setUserEditing(false);
        setIsTyping(false);
      }, debounce);

      return () => clearTimeout(handler);
    }
  }, [value, onChange, debounce, userEditing]);

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="input-container flex items-center border-b w-full">
        <input
          aria-label={label}
          ref={inputRef}
          value={value}
          type="number"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="outline-none w-full font-bold"
          disabled={isLoading}
        />
        {isTyping && (
          <div className="w-4 h-3 border border-gray-300 border-t-green-500 rounded-full animate-spin" />
        )}
        <span className="pl-2 text-gray-500">{currency}</span>
      </div>

      {error && (
        <p className="text-sm text-red-500 absolute -bottom-6 min-w-64">
          {error}
        </p>
      )}
    </div>
  );
};

export default DebouncedInput;
