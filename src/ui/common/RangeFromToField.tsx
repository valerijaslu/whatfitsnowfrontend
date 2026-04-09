import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/range.css";

type Props = {
  label: string;
  fromName: string;
  toName: string;
  fromValue: number;
  toValue: number;
  onChange: (next: { from: number; to: number }) => void;
  min: number;
  max: number;
  step?: number;
  fromLabel?: string;
  toLabel?: string;
  fromError?: string | null;
  toError?: string | null;
};

function toNumber(raw: string, fallback: number) {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function RangeFromToField({
  label,
  fromName,
  toName,
  fromValue,
  toValue,
  onChange,
  min,
  max,
  step = 1,
  fromLabel = "From",
  toLabel = "To",
  fromError,
  toError,
}: Props) {
  const marksId = `${fromName}-${toName}-marks`;
  const marks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  function setFrom(nextFrom: number) {
    const next = { from: nextFrom, to: Math.max(nextFrom, toValue) };
    onChange(next);
  }

  function setTo(nextTo: number) {
    const next = { from: Math.min(fromValue, nextTo), to: nextTo };
    onChange(next);
  }

  return (
    <div className="field">
      <div className="rangeGroupHeader">
        <strong>{label}</strong>
        <span className="rangeValue">
          {fromValue}–{toValue}
        </span>
      </div>

      <div className="rangeGroup">
        <label className="rangeSubLabel" htmlFor={fromName}>
          {fromLabel}
        </label>
        <div className="rangeRow">
          <input
            className="range"
            id={fromName}
            name={fromName}
            type="range"
            min={min}
            max={max}
            step={step}
            value={fromValue}
            list={marksId}
            onChange={(e) => setFrom(toNumber(e.target.value, fromValue))}
          />
          <div className="rangeValue">{fromValue}</div>
        </div>
        {fromError ? <div className="error">{fromError}</div> : null}

        <label className="rangeSubLabel" htmlFor={toName}>
          {toLabel}
        </label>
        <div className="rangeRow">
          <input
            className="range"
            id={toName}
            name={toName}
            type="range"
            min={min}
            max={max}
            step={step}
            value={toValue}
            list={marksId}
            onChange={(e) => setTo(toNumber(e.target.value, toValue))}
          />
          <div className="rangeValue">{toValue}</div>
        </div>
        {toError ? <div className="error">{toError}</div> : null}
      </div>

      <datalist id={marksId}>
        {marks.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
    </div>
  );
}

