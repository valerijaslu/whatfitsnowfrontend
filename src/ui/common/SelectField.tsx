import "@/ui/common/forms.css";
import "@/ui/common/typography.css";

import type { SelectHTMLAttributes } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  label: string;
  name: string;
  value: T;
  options: ReadonlyArray<Option<T>>;
  onChange: (next: T) => void;
  error?: string | null;
  selectProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "value" | "onChange">;
};

export function SelectField<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  error,
  selectProps,
}: Props<T>) {
  return (
    <div className="field">
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <select
        className="input"
        id={name}
        name={name}
        value={value}
        {...selectProps}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

