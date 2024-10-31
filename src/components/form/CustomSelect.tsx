// components/CustomSelect.tsx
import { useState, useRef, useEffect, FC } from "react";
import Image from "next/image";

interface Option {
  value: string;
  label: string;
  image: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  label: string;
  onChange: (value: string) => void;
}

const CustomSelect: FC<CustomSelectProps> = ({
  options,
  value,
  label,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <p className="text-xs text-gray-500">{label}</p>
      <div
        className="flex items-center justify-between border-b cursor-pointer p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <Image
              src={selectedOption.image}
              width={20}
              height={15}
              alt={selectedOption.label}
              className="border rounded-sm"
            />
          ) : (
            <div className="h-4 w-5 border rounded-sm bg-gray-200" />
          )}

          <span className="">{value}</span>
        </div>

        <Image
          src="/assets/common/down-arrow.svg"
          width={15}
          height={15}
          alt="Expand"
        />
      </div>
      {isOpen && (
        <ul className="absolute w-full z-10 border bg-white">
          {options.map((option) => (
            <li
              key={option.value}
              className="flex items-center pl-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <Image
                src={option.image}
                width={20}
                height={15}
                alt={option.label}
                className="border rounded-sm"
              />
              <span className="ml-2">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
