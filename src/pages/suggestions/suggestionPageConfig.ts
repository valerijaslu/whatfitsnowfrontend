import type { PreferredLocationType, PreferredSocialType } from "@/api/suggestions";
import type { EffortLevel } from "@/api/activities";

export const SUGGESTION_LIMITS = {
  levelMin: 1,
  levelMax: 5,
  minutesMin: 1,
  minutesMax: 1440,
} as const;

export const SUGGESTION_DEFAULTS = {
  effortLevel: "LOW" as EffortLevel,
  preferredLocationType: "ANY" as PreferredLocationType,
  preferredSocialType: "ANY" as PreferredSocialType,
  availableMinutes: String(SUGGESTION_LIMITS.minutesMin),
} as const;

export const EFFORT_OPTIONS: ReadonlyArray<{ value: EffortLevel; label: string }> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const PREFERRED_LOCATION_OPTIONS: ReadonlyArray<{ value: PreferredLocationType; label: string }> = [
  { value: "ANY", label: "Any" },
  { value: "INDOOR", label: "Indoor" },
  { value: "OUTDOOR", label: "Outdoor" },
];

export const PREFERRED_SOCIAL_OPTIONS: ReadonlyArray<{ value: PreferredSocialType; label: string }> = [
  { value: "ANY", label: "Any" },
  { value: "ALONE", label: "Alone" },
  { value: "SOCIAL", label: "Social" },
];

