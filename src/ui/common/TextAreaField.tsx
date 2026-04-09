type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  error?: string | null;
};

export function TextAreaField({ label, name, value, onChange, placeholder, error }: Props) {
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
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

