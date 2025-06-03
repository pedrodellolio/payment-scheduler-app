import { useEffect, useState } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export default function CurrencyInput({
  value,
  onChange,
  className = "",
  placeholder,
}: Props) {
  const [displayValue, setDisplayValue] = useState("");

  const formatToBRL = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseFloat(inputValue.replace(/\D/g, "")) / 100;
    setDisplayValue(formatToBRL(numericValue));
    onChange(numericValue);
  };

  useEffect(() => {
    setDisplayValue(formatToBRL(value));
  }, [value]);

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder || "R$ 0,00"}
      className={className}
    />
  );
}
