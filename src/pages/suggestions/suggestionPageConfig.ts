import type { HealthCompatibility, PreferredLocationType, PreferredSocialType } from "@/api/suggestions";
import type { WeatherCompatibility } from "@/api/activities";

export const SUGGESTION_LIMITS = {
  levelMin: 1,
  levelMax: 5,
  minutesMin: 1,
  minutesMax: 1440,
  topN: 3,
} as const;

export const SUGGESTION_DEFAULTS = {
  healthCompatibility: "ANY" as HealthCompatibility,
  preferredLocationType: "ANY" as PreferredLocationType,
  preferredSocialType: "ANY" as PreferredSocialType,
  currentWeather: "ANY" as WeatherCompatibility,
  availableMinutes: String(SUGGESTION_LIMITS.minutesMin),
} as const;

export const HEALTH_COMPATIBILITY_OPTIONS: ReadonlyArray<{ value: HealthCompatibility; label: string }> = [
  { value: "ANY", label: "Any" },
  { value: "HEALTHY", label: "Healthy" },
  { value: "ILL", label: "Ill" },
  { value: "MUSCLE_FATIGUE", label: "Muscle fatigue" },
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

export const WEATHER_OPTIONS: ReadonlyArray<{ value: WeatherCompatibility; label: string }> = [
  { value: "ANY", label: "Any" },
  { value: "SUNNY", label: "Sunny" },
  { value: "RAINY", label: "Rainy" },
  { value: "COLD", label: "Cold" },
  { value: "HOT", label: "Hot" },
];

