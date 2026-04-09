import type { EffortLevel, HealthCompatibility, LocationType, SocialType, WeatherCompatibility } from "@/api/activities";

export const ACTIVITY_LIMITS = {
  titleMax: 120,
  durationMin: 1,
  durationMax: 1440,
} as const;

export const ACTIVITY_DEFAULTS = {
  effortLevel: "LOW" as EffortLevel,
  locationType: "INDOOR" as LocationType,
  socialType: "ALONE" as SocialType,
  weatherCompatibility: "ANY" as WeatherCompatibility,
  healthCompatibility: "ANY" as HealthCompatibility,
  isActive: true,
} as const;

export const EFFORT_OPTIONS: ReadonlyArray<{ value: EffortLevel; label: string }> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export const LOCATION_OPTIONS: ReadonlyArray<{ value: LocationType; label: string }> = [
  { value: "INDOOR", label: "Indoor" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "BOTH", label: "Both" },
];

export const SOCIAL_OPTIONS: ReadonlyArray<{ value: SocialType; label: string }> = [
  { value: "ALONE", label: "Alone" },
  { value: "SOCIAL", label: "Social" },
  { value: "BOTH", label: "Both" },
];

export const WEATHER_OPTIONS: ReadonlyArray<{ value: WeatherCompatibility; label: string }> = [
  { value: "ANY", label: "Any" },
  { value: "SUNNY", label: "Sunny" },
  { value: "RAINY", label: "Rainy" },
  { value: "COLD", label: "Cold" },
  { value: "HOT", label: "Hot" },
];

export const HEALTH_OPTIONS: ReadonlyArray<{ value: HealthCompatibility; label: string }> = [
  { value: "ANY", label: "Any" },
  { value: "HEALTHY", label: "Healthy" },
  { value: "ILL", label: "Ill" },
  { value: "MUSCLE_FATIGUE", label: "Muscle fatigue" },
];

