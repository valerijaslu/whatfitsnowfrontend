type Props = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (next: boolean) => void;
};

export function CheckboxField({ label, name, checked, onChange }: Props) {
  return (
    <div className="checkboxRow">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
    </div>
  );
}

