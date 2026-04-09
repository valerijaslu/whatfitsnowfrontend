import "@/ui/common/forms.css";
import "@/ui/common/typography.css";

import type { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (next: string) => void;
  autoComplete?: string;
  placeholder?: string;
  error?: string | null;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "type" | "value" | "onChange">;
};

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
  inputProps,
}: Props) {
  return (
    <div className="field">
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <input
        className="input"
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...inputProps}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

