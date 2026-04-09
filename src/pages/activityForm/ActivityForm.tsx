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
  TAGS_HELPER_TEXT,
  WEATHER_OPTIONS,
} from "@/pages/activityForm/activityFormConfig";
import type { ActivityFieldErrors } from "@/pages/activityForm/activityFormErrors";
import { FormField } from "@/ui/FormField";
import { CheckboxField } from "@/ui/common/CheckboxField";
import { SelectField } from "@/ui/common/SelectField";
import { TextAreaField } from "@/ui/common/TextAreaField";
import "@/ui/common/surface.css";
import "@/ui/common/forms.css";
import "@/ui/common/typography.css";
import "@/ui/common/buttons.css";
import { Link } from "react-router-dom";

export type ActivityFormValues = {
  title: string;
  description: string;
  durationMinutes: string;
  effortLevel: EffortLevel;
  locationType: LocationType;
  socialType: SocialType;
  weatherCompatibility: WeatherCompatibility;
  healthCompatibility: HealthCompatibility;
  tagsRaw: string;
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
          <div className="grid2">
            <FormField
              label="Title"
              name="title"
              value={values.title}
              onChange={(v) => onChange({ title: v })}
              placeholder="e.g. 20-minute walk"
              error={errors.title ?? null}
              inputProps={{ required: true, maxLength: ACTIVITY_LIMITS.titleMax }}
            />
            <FormField
              label="Duration (minutes)"
              name="durationMinutes"
              type="number"
              value={values.durationMinutes}
              onChange={(v) => onChange({ durationMinutes: v })}
              error={errors.durationMinutes ?? null}
              inputProps={{
                required: true,
                min: ACTIVITY_LIMITS.durationMin,
                max: ACTIVITY_LIMITS.durationMax,
                step: 1,
              }}
            />
          </div>

          <TextAreaField
            label="Description"
            name="description"
            value={values.description}
            onChange={(v) => onChange({ description: v })}
            placeholder="Optional notes, setup, constraints…"
            error={errors.description ?? null}
            textAreaProps={{ maxLength: ACTIVITY_LIMITS.descriptionMax }}
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

          <div className="divider" />

          <FormField
            label="Tags"
            name="tags"
            value={values.tagsRaw}
            onChange={(v) => onChange({ tagsRaw: v })}
            placeholder={TAGS_HELPER_TEXT}
            error={errors.tags ?? null}
            inputProps={{ maxLength: 255 }}
          />

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

