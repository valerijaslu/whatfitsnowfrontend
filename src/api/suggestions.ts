import { http } from "@/api/http";
import type { EffortLevel } from "@/api/activities";

export type PreferredLocationType = "INDOOR" | "OUTDOOR" | "ANY";
export type PreferredSocialType = "ALONE" | "SOCIAL" | "ANY";

export type SuggestionRequest = {
  energyLevel: number;
  preferredLocationType: PreferredLocationType;
  preferredSocialType: PreferredSocialType;
  availableMinutes: number;
};

export type SuggestedActivityResponse = {
  activityId: number;
  title: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  effortLevel: EffortLevel;
  locationType: string;
  socialType: string;
  score: number;
  reasons: string[];
};

export async function suggestActivities(input: SuggestionRequest) {
  const res = await http.post<SuggestedActivityResponse[]>("/api/suggestions", input);
  return res.data;
}

