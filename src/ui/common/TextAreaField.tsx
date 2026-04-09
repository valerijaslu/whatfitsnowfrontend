import "@/ui/common/forms.css";
import "@/ui/common/typography.css";

import type { TextareaHTMLAttributes } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  error?: string | null;
  textAreaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name" | "value" | "onChange">;
};

export function TextAreaField({ label, name, value, onChange, placeholder, error, textAreaProps }: Props) {
  return (
    <div className="field">
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <textarea
        className="input textarea"
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...textAreaProps}
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

