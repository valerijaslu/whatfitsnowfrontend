import type { CreateActivityRequest, EffortLevel, LocationType, SocialType, WeatherCompatibility } from "@/api/activities";
import {
  EFFORT_OPTIONS,
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
  pleasureScore: string;
  satisfactionScore: string;
  locationType: LocationType;
  socialType: SocialType;
  weatherCompatibility: WeatherCompatibility;
  minEnergy: string;
  maxEnergy: string;
  minHealth: string;
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
            />
            <FormField
              label="Duration (minutes)"
              name="durationMinutes"
              type="number"
              value={values.durationMinutes}
              onChange={(v) => onChange({ durationMinutes: v })}
              error={errors.durationMinutes ?? null}
            />
          </div>

          <TextAreaField
            label="Description"
            name="description"
            value={values.description}
            onChange={(v) => onChange({ description: v })}
            placeholder="Optional notes, setup, constraints…"
            error={errors.description ?? null}
          />

          <div className="divider" />

          <div className="grid3">
            <SelectField
              label="Effort level"
              name="effortLevel"
              value={values.effortLevel}
              options={EFFORT_OPTIONS}
              onChange={(v) => onChange({ effortLevel: v })}
              error={errors.effortLevel ?? null}
            />

            <FormField
              label="Pleasure score"
              name="pleasureScore"
              type="number"
              value={values.pleasureScore}
              onChange={(v) => onChange({ pleasureScore: v })}
              error={errors.pleasureScore ?? null}
            />
            <FormField
              label="Satisfaction score"
              name="satisfactionScore"
              type="number"
              value={values.satisfactionScore}
              onChange={(v) => onChange({ satisfactionScore: v })}
              error={errors.satisfactionScore ?? null}
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
            />

            <SelectField
              label="Social type"
              name="socialType"
              value={values.socialType}
              options={SOCIAL_OPTIONS}
              onChange={(v) => onChange({ socialType: v })}
              error={errors.socialType ?? null}
            />

            <SelectField
              label="Weather compatibility"
              name="weatherCompatibility"
              value={values.weatherCompatibility}
              options={WEATHER_OPTIONS}
              onChange={(v) => onChange({ weatherCompatibility: v })}
              error={errors.weatherCompatibility ?? null}
            />
          </div>

          <div className="divider" />

          <div className="grid3">
            <FormField
              label="Min energy"
              name="minEnergy"
              type="number"
              value={values.minEnergy}
              onChange={(v) => onChange({ minEnergy: v })}
              error={errors.minEnergy ?? null}
            />
            <FormField
              label="Max energy"
              name="maxEnergy"
              type="number"
              value={values.maxEnergy}
              onChange={(v) => onChange({ maxEnergy: v })}
              error={errors.maxEnergy ?? null}
            />
            <FormField
              label="Min health"
              name="minHealth"
              type="number"
              value={values.minHealth}
              onChange={(v) => onChange({ minHealth: v })}
              error={errors.minHealth ?? null}
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

