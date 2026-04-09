import { useMemo, useState } from "react";
import axios from "axios";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";
import { suggestActivities, type SuggestedActivityResponse } from "@/api/suggestions";
import type { HealthCompatibility, PreferredLocationType, PreferredSocialType } from "@/api/suggestions";
import type { WeatherCompatibility } from "@/api/activities";
import { SelectField } from "@/ui/common/SelectField";
import { FormField } from "@/ui/FormField";
import {
  HEALTH_COMPATIBILITY_OPTIONS,
  PREFERRED_LOCATION_OPTIONS,
  PREFERRED_SOCIAL_OPTIONS,
  SUGGESTION_DEFAULTS,
  SUGGESTION_LIMITS,
  WEATHER_OPTIONS,
} from "@/pages/suggestions/suggestionPageConfig";
import { clampInt, parseIntOr } from "@/pages/suggestions/suggestionPageUtils";

export function SuggestionPage() {
  const [healthCompatibility, setHealthCompatibility] = useState<HealthCompatibility>(
    SUGGESTION_DEFAULTS.healthCompatibility,
  );
  const [preferredLocationType, setPreferredLocationType] = useState<PreferredLocationType>(
    SUGGESTION_DEFAULTS.preferredLocationType,
  );
  const [preferredSocialType, setPreferredSocialType] = useState<PreferredSocialType>(
    SUGGESTION_DEFAULTS.preferredSocialType,
  );
  const [currentWeather, setCurrentWeather] = useState<WeatherCompatibility>(SUGGESTION_DEFAULTS.currentWeather);
  const [availableMinutes, setAvailableMinutes] = useState(SUGGESTION_DEFAULTS.availableMinutes);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SuggestedActivityResponse[] | null>(null);

  const request = useMemo(
    () => ({
      currentHealth: healthCompatibility,
      preferredLocationType,
      preferredSocialType,
      currentWeather,
      availableMinutes: clampInt(
        parseIntOr(SUGGESTION_LIMITS.minutesMin, availableMinutes),
        SUGGESTION_LIMITS.minutesMin,
        SUGGESTION_LIMITS.minutesMax,
      ),
    }),
    [healthCompatibility, preferredLocationType, preferredSocialType, currentWeather, availableMinutes],
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

  const top3 = results ? results.slice(0, SUGGESTION_LIMITS.topN) : null;

  return (
    <div className="stack">
      <div className="card">
        <div className="stack">
          <h2 className="pageTitle">Find something that fits right now</h2>
          <div className="muted">Tell me what you’ve got to work with. I’ll suggest up to three activities.</div>

          <form className="stack" onSubmit={onSubmit} aria-busy={isSubmitting}>
            <SelectField
              label="Health"
              name="healthCompatibility"
              value={healthCompatibility}
              options={HEALTH_COMPATIBILITY_OPTIONS}
              onChange={setHealthCompatibility}
              selectProps={{ required: true }}
            />

            <div className="grid3">
              <SelectField
                label="Preferred location"
                name="preferredLocationType"
                value={preferredLocationType}
                options={PREFERRED_LOCATION_OPTIONS}
                onChange={setPreferredLocationType}
              />
              <SelectField
                label="Preferred social"
                name="preferredSocialType"
                value={preferredSocialType}
                options={PREFERRED_SOCIAL_OPTIONS}
                onChange={setPreferredSocialType}
              />
              <SelectField
                label="Current weather"
                name="currentWeather"
                value={currentWeather}
                options={WEATHER_OPTIONS}
                onChange={setCurrentWeather}
              />
            </div>

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

          {!isSubmitting && top3 && top3.length === 0 ? (
            <div className="muted">
              Nothing matched those inputs. Try increasing available minutes, or choose “Any” for location/social/weather.
            </div>
          ) : null}

          {!isSubmitting && top3 && top3.length > 0 ? (
            <div className="stack">
              {top3.map((s) => (
                <div key={s.activityId} className="card">
                  <div className="stack">
                    <div className="rowSpaceBetween row">
                      <strong>{s.title}</strong>
                      <span className="muted">{s.durationMinutes} min</span>
                    </div>
                    {s.description ? <div className="muted">{s.description}</div> : null}
                    {s.tags && s.tags.length > 0 ? (
                      <div className="muted">Tags: {s.tags.join(", ")}</div>
                    ) : null}
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

