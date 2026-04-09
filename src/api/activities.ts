import { http } from "@/api/http";

export type EffortLevel = "LOW" | "MEDIUM" | "HIGH";
export type HealthCompatibility = "ANY" | "HEALTHY" | "ILL" | "MUSCLE_FATIGUE";
export type LocationType = "INDOOR" | "OUTDOOR" | "BOTH";
export type SocialType = "ALONE" | "SOCIAL" | "BOTH";
export type WeatherCompatibility = "ANY" | "SUNNY" | "RAINY" | "COLD" | "HOT";

export type ActivityDto = {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  durationMinutes: number;
  effortLevel: EffortLevel;
  locationType: LocationType;
  socialType: SocialType;
  weatherCompatibility: WeatherCompatibility;
  healthCompatibility: HealthCompatibility;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

export type CreateActivityRequest = {
  title: string;
  description: string | null;
  durationMinutes: number;
  effortLevel: EffortLevel;
  locationType: LocationType;
  socialType: SocialType;
  weatherCompatibility: WeatherCompatibility;
  healthCompatibility: HealthCompatibility;
  isActive?: boolean;
  tags: string[];
};

export type UpdateActivityRequest = Omit<CreateActivityRequest, "isActive"> & { isActive: boolean };

export async function getActivity(id: number) {
  const res = await http.get<ActivityDto>(`/api/activities/${encodeURIComponent(String(id))}`);
  return res.data;
}

export async function createActivity(input: CreateActivityRequest) {
  const res = await http.post<ActivityDto>("/api/activities", input);
  return res.data;
}

export async function updateActivity(id: number, input: UpdateActivityRequest) {
  const res = await http.put<ActivityDto>(`/api/activities/${encodeURIComponent(String(id))}`, input);
  return res.data;
}

