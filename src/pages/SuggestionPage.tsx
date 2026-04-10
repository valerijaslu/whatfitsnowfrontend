import { useMemo, useState } from "react";
import axios from "axios";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";
import { suggestActivities, type SuggestedActivityResponse } from "@/api/suggestions";
import type { PreferredLocationType } from "@/api/suggestions";
import type { EffortLevel } from "@/api/activities";
import { SelectField } from "@/ui/common/SelectField";
import { FormField } from "@/ui/FormField";
import {
  EFFORT_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  PREFERRED_SOCIAL_DEFAULT,
  SUGGESTION_DEFAULTS,
  SUGGESTION_LIMITS,
} from "@/pages/suggestions/suggestionPageConfig";
import { clampInt, parseIntOr } from "@/pages/suggestions/suggestionPageUtils";

function effortToEnergyLevel(effortLevel: EffortLevel) {
  if (effortLevel === "LOW") return 2;
  if (effortLevel === "HIGH") return 4;
  return 3;
}

export function SuggestionPage() {
  const [effortLevel, setEffortLevel] = useState<EffortLevel>(SUGGESTION_DEFAULTS.effortLevel);
  const [preferredLocationType, setPreferredLocationType] = useState<PreferredLocationType>(
    SUGGESTION_DEFAULTS.preferredLocationType,
  );
  const [availableMinutes, setAvailableMinutes] = useState(SUGGESTION_DEFAULTS.availableMinutes);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SuggestedActivityResponse[] | null>(null);

  const request = useMemo(
    () => ({
      energyLevel: effortToEnergyLevel(effortLevel),
      preferredLocationType,
      preferredSocialType: PREFERRED_SOCIAL_DEFAULT,
      availableMinutes: clampInt(
        parseIntOr(SUGGESTION_LIMITS.minutesMin, availableMinutes),
        SUGGESTION_LIMITS.minutesMin,
        SUGGESTION_LIMITS.minutesMax,
      ),
    }),
    [effortLevel, preferredLocationType, availableMinutes],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);
    setIsSubmitting(true);
    try {
      const data = await suggestActivities(request);
      setResults(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as any)?.message ||
          err.response?.statusText ||
          err.message ||
          "Failed to get suggestions.";
        setError(String(msg));
      } else {
        setError(err instanceof Error ? err.message : "Failed to get suggestions.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const all = results;

  return (
    <div className="stack">
      <div className="card">
        <div className="stack">
          <h2 className="pageTitle">Find something that fits right now</h2>
          <div className="muted">Tell me what you’ve got to work with. I’ll suggest activities that fit.</div>

          <form className="stack" onSubmit={onSubmit} aria-busy={isSubmitting}>
            <SelectField
              label="Effort"
              name="effortLevel"
              value={effortLevel}
              options={EFFORT_OPTIONS}
              onChange={setEffortLevel}
              selectProps={{ required: true }}
            />

            <SelectField
              label="Preferred location"
              name="preferredLocationType"
              value={preferredLocationType}
              options={PREFERRED_LOCATION_OPTIONS}
              onChange={setPreferredLocationType}
            />

            <FormField
              label="Available minutes"
              name="availableMinutes"
              type="number"
              value={availableMinutes}
              onChange={setAvailableMinutes}
            />

            <div className="actions">
              <button className="btn primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Finding matches…" : "Suggest activities"}
              </button>
            </div>
          </form>

          {error ? <div className="error">{error}</div> : null}
        </div>
      </div>

      <div className="card">
        <div className="stack">
          <h2 className="pageTitle">Suggestions</h2>

          {isSubmitting ? <div className="muted">Looking for a good fit…</div> : null}

          {!isSubmitting && all && all.length === 0 ? (
            <div className="muted">
              Nothing matched those inputs. Try increasing available minutes or selecting “Any” for location.
            </div>
          ) : null}

          {!isSubmitting && all && all.length > 0 ? (
            <div className="stack">
              {all.map((s) => (
                <div key={s.activityId} className="card">
                  <div className="stack">
                    <div className="rowSpaceBetween row">
                      <strong>{s.title}</strong>
                      <span className="muted">
                        {s.minDurationMinutes === s.maxDurationMinutes
                          ? `${s.minDurationMinutes} min`
                          : `${s.minDurationMinutes}–${s.maxDurationMinutes} min`}
                      </span>
                    </div>
                    <div className="muted">
                      {s.effortLevel} · {s.locationType} · {s.socialType}
                    </div>
                    {s.reasons?.length ? (
                      <div className="stack">
                        <strong>Why this fits</strong>
                        <ul className="list">
                          {s.reasons.map((r, idx) => (
                            <li key={`${s.activityId}-${idx}`}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!isSubmitting && results === null ? <div className="muted">Submit the form to get suggestions.</div> : null}
        </div>
      </div>
    </div>
  );
}

