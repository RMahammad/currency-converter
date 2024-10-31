import {
  useState,
  useEffect,
  ChangeEvent,
  FC,
  KeyboardEvent,
  useRef,
} from "react";

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
  debounce = 1000,
}) => {
  const [value, setValue] = useState<number>(amountToSend);
  const [userEditing, setUserEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userEditing) {
      setValue(amountToSend);
    }
  }, [amountToSend, userEditing]);

  useEffect(() => {
    if (userEditing) {
      const handler = setTimeout(() => {
        onChange(value);
        setUserEditing(false);
      }, debounce);

      return () => clearTimeout(handler);
    }
  }, [value, onChange, debounce, userEditing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
    setUserEditing(true);
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

  return (
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
      <span className="pl-2 text-gray-500">{fromCurrency}</span>
    </div>
  );
};

export default DebouncedInput;
