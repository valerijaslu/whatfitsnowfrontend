import type {
  EffortLevel,
  HealthCompatibility,
  LocationType,
  SocialType,
  WeatherCompatibility,
} from "@/api/activities";
import {
  ACTIVITY_LIMITS,
  EFFORT_OPTIONS,
  HEALTH_OPTIONS,
  LOCATION_OPTIONS,
  SOCIAL_OPTIONS,
  WEATHER_OPTIONS,
} from "@/pages/activityForm/activityFormConfig";
import type { ActivityFieldErrors } from "@/pages/activityForm/activityFormErrors";
import { FormField } from "@/ui/FormField";
import { CheckboxField } from "@/ui/common/CheckboxField";
import { SelectField } from "@/ui/common/SelectField";
import { RangeField } from "@/ui/common/RangeField";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";
import { Link } from "react-router-dom";

export type ActivityFormValues = {
  title: string;
  minDurationMinutes: string;
  maxDurationMinutes: string;
  effortLevel: EffortLevel;
  locationType: LocationType;
  socialType: SocialType;
  weatherCompatibility: WeatherCompatibility;
  healthCompatibility: HealthCompatibility;
  isActive: boolean;
};

type Props = {
  mode: "create" | "edit";
  isLoading: boolean;
  isSubmitting: boolean;
  activityId: number | null;
  values: ActivityFormValues;
  errors: ActivityFieldErrors;
  onChange: (patch: Partial<ActivityFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function ActivityForm({
  mode,
  isLoading,
  isSubmitting,
  activityId,
  values,
  errors,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="card">
      <div className="stack">
        <h2 className="pageTitle">{mode === "create" ? "Create activity" : "Edit activity"}</h2>

        {errors.form ? <div className="error">{errors.form}</div> : null}

        {mode === "edit" ? <div className="muted">Editing activity id: {activityId ?? ""}</div> : null}
        {isLoading ? <div className="muted">Loading…</div> : null}

        <form className="stack" onSubmit={onSubmit} aria-busy={isSubmitting}>
          <FormField
            label="Title"
            name="title"
            value={values.title}
            onChange={(v) => onChange({ title: v })}
            placeholder="e.g. 20-minute walk"
            error={errors.title ?? null}
            inputProps={{ required: true, maxLength: ACTIVITY_LIMITS.titleMax }}
          />

          <RangeField
            label="Min duration (minutes)"
            name="minDurationMinutes"
            value={Number.parseInt(values.minDurationMinutes, 10) || ACTIVITY_LIMITS.durationMin}
            onChange={(n) => onChange({ minDurationMinutes: String(n) })}
            min={ACTIVITY_LIMITS.durationMin}
            max={ACTIVITY_LIMITS.durationMax}
            step={1}
            marks={[5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720, 1440]}
            error={errors.minDurationMinutes ?? null}
          />

          <RangeField
            label="Max duration (minutes)"
            name="maxDurationMinutes"
            value={Number.parseInt(values.maxDurationMinutes, 10) || ACTIVITY_LIMITS.durationMax}
            onChange={(n) => onChange({ maxDurationMinutes: String(n) })}
            min={ACTIVITY_LIMITS.durationMin}
            max={ACTIVITY_LIMITS.durationMax}
            step={1}
            marks={[5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720, 1440]}
            error={errors.maxDurationMinutes ?? null}
          />

          <div className="divider" />

          <div className="grid2">
            <SelectField
              label="Effort level"
              name="effortLevel"
              value={values.effortLevel}
              options={EFFORT_OPTIONS}
              onChange={(v) => onChange({ effortLevel: v })}
              error={errors.effortLevel ?? null}
              selectProps={{ required: true }}
            />

            <SelectField
              label="Health"
              name="healthCompatibility"
              value={values.healthCompatibility}
              options={HEALTH_OPTIONS}
              onChange={(v) => onChange({ healthCompatibility: v })}
              error={errors.healthCompatibility ?? null}
              selectProps={{ required: true }}
            />
          </div>

          <div className="grid3">
            <SelectField
              label="Location type"
              name="locationType"
              value={values.locationType}
              options={LOCATION_OPTIONS}
              onChange={(v) => onChange({ locationType: v })}
              error={errors.locationType ?? null}
              selectProps={{ required: true }}
            />

            <SelectField
              label="Social type"
              name="socialType"
              value={values.socialType}
              options={SOCIAL_OPTIONS}
              onChange={(v) => onChange({ socialType: v })}
              error={errors.socialType ?? null}
              selectProps={{ required: true }}
            />

            <SelectField
              label="Weather compatibility"
              name="weatherCompatibility"
              value={values.weatherCompatibility}
              options={WEATHER_OPTIONS}
              onChange={(v) => onChange({ weatherCompatibility: v })}
              error={errors.weatherCompatibility ?? null}
              selectProps={{ required: true }}
            />
          </div>

          <CheckboxField
            label="Active"
            name="isActive"
            checked={values.isActive}
            onChange={(v) => onChange({ isActive: v })}
          />

          <div className="actions">
            <Link className="btn" to="/activities">
              Cancel
            </Link>
            <button className="btn primary" type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

