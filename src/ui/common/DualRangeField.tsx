import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/range.css";
import type React from "react";

type Props = {
  label: string;
  minName: string;
  maxName: string;
  minValue: number;
  maxValue: number;
  onChange: (next: { min: number; max: number }) => void;
  min: number;
  max: number;
  step?: number;
  errorMin?: string | null;
  errorMax?: string | null;
  marks?: number[];
};

function toNumber(raw: string, fallback: number) {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function DualRangeField({
  label,
  minName,
  maxName,
  minValue,
  maxValue,
  onChange,
  min,
  max,
  step = 1,
  errorMin,
  errorMax,
  marks,
}: Props) {
  const left = Math.max(min, Math.min(minValue, maxValue));
  const right = Math.min(max, Math.max(maxValue, minValue));

  const pctLeft = ((left - min) / (max - min)) * 100;
  const pctRight = ((right - min) / (max - min)) * 100;

  const listId = `${minName}-${maxName}-marks`;
  const resolvedMarks = marks ?? [];
  const showMarks = resolvedMarks.length > 0 && resolvedMarks.length <= 15;

  function setLeft(next: number) {
    onChange({ min: Math.min(next, right), max: right });
  }

  function setRight(next: number) {
    onChange({ min: left, max: Math.max(next, left) });
  }

  return (
    <div className="field">
      <div className="rangeGroupHeader">
        <strong>{label}</strong>
        <span className="rangeValue">
          {left}–{right} min
        </span>
      </div>

      <div className="dualRange">
        <div
          className="dualRangeTrack"
          style={
            {
              "--from": `${pctLeft}%`,
              "--to": `${pctRight}%`,
            } as React.CSSProperties
          }
        />

        <input
          className="dualRangeInput"
          id={minName}
          name={minName}
          type="range"
          min={min}
          max={max}
          step={step}
          value={left}
          list={showMarks ? listId : undefined}
          onChange={(e) => setLeft(toNumber(e.target.value, left))}
        />
        <input
          className="dualRangeInput"
          id={maxName}
          name={maxName}
          type="range"
          min={min}
          max={max}
          step={step}
          value={right}
          list={showMarks ? listId : undefined}
          onChange={(e) => setRight(toNumber(e.target.value, right))}
        />
      </div>

      {errorMin ? <div className="error">{errorMin}</div> : null}
      {!errorMin && errorMax ? <div className="error">{errorMax}</div> : null}

      {showMarks ? (
        <datalist id={listId}>
          {resolvedMarks.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      ) : null}
    </div>
  );
}

