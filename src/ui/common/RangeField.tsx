import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/range.css";

type Props = {
  label: string;
  name: string;
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step?: number;
  error?: string | null;
};

function toNumber(raw: string, fallback: number) {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function RangeField({ label, name, value, onChange, min, max, step = 1, error }: Props) {
  const listId = `${name}-marks`;
  const marks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="field">
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>

      <div className="rangeRow">
        <input
          className="range"
          id={name}
          name={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          list={listId}
          onChange={(e) => onChange(toNumber(e.target.value, value))}
        />
        <div className="rangeValue">{value}</div>
      </div>

      <datalist id={listId}>
        {marks.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>

      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

