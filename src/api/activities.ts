import { http } from "@/api/http";

export type EffortLevel = "LOW" | "MEDIUM" | "HIGH";
export type LocationType = "INDOOR" | "OUTDOOR" | "BOTH";
export type SocialType = "ALONE" | "SOCIAL" | "BOTH";

export type ActivityDto = {
  id: number;
  userId: number;
  title: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  effortLevel: EffortLevel;
  locationType: LocationType;
  socialType: SocialType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateActivityRequest = {
  title: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  effortLevel: EffortLevel;
  locationType: LocationType;
  socialType: SocialType;
  isActive?: boolean;
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

export async function listActivities() {
  const res = await http.get<ActivityDto[]>("/api/activities");
  return res.data;
}

export async function deleteActivity(id: number) {
  await http.delete(`/api/activities/${encodeURIComponent(String(id))}`);
}

