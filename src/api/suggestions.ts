import { http } from "@/api/http";
import type { WeatherCompatibility } from "@/api/activities";

export type PreferredLocationType = "INDOOR" | "OUTDOOR" | "ANY";
export type PreferredSocialType = "ALONE" | "SOCIAL" | "ANY";

export type SuggestionRequest = {
  energyLevel: number;
  healthLevel: number;
  preferredLocationType: PreferredLocationType;
  preferredSocialType: PreferredSocialType;
  currentWeather: WeatherCompatibility;
  availableMinutes: number;
};

export type SuggestedActivityResponse = {
  activityId: number;
  title: string;
  description: string | null;
  durationMinutes: number;
  score: number;
  tags?: string[];
  reasons: string[];
};

export async function suggestActivities(input: SuggestionRequest) {
  const res = await http.post<SuggestedActivityResponse[]>("/api/suggestions", input);
  return res.data;
}

