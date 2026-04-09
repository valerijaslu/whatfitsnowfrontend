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
  marks?: number[];
};

function toNumber(raw: string, fallback: number) {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function RangeField({ label, name, value, onChange, min, max, step = 1, error, marks }: Props) {
  const listId = `${name}-marks`;
  const resolvedMarks = marks ?? Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const showMarks = resolvedMarks.length > 0 && resolvedMarks.length <= 15;

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
          list={showMarks ? listId : undefined}
          onChange={(e) => onChange(toNumber(e.target.value, value))}
        />
        <div className="rangeValue">{value}</div>
      </div>

      {showMarks ? (
        <datalist id={listId}>
          {resolvedMarks.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      ) : null}

      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}

