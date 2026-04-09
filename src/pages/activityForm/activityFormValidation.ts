import type { CreateActivityRequest } from "@/api/activities";
import { ACTIVITY_LIMITS } from "@/pages/activityForm/activityFormConfig";
import { normalizeTags } from "@/pages/activityForm/activityFormUtils";
import type { ActivityFieldErrors } from "@/pages/activityForm/activityFormErrors";

const MIN_TEXT_LENGTH = 1;

export function validateActivity(input: CreateActivityRequest, tagsRaw: string): ActivityFieldErrors {
  const e: ActivityFieldErrors = {};

  if (input.title.trim().length < MIN_TEXT_LENGTH) e.title = "Title is required.";
  if (input.title.trim().length > ACTIVITY_LIMITS.titleMax) {
    e.title = `Title must be at most ${ACTIVITY_LIMITS.titleMax} characters.`;
  }

  if (input.description && input.description.length > ACTIVITY_LIMITS.descriptionMax) {
    e.description = `Description must be at most ${ACTIVITY_LIMITS.descriptionMax} characters.`;
  }

  if (!Number.isFinite(input.durationMinutes) || input.durationMinutes < ACTIVITY_LIMITS.durationMin) {
    e.durationMinutes = `Duration must be at least ${ACTIVITY_LIMITS.durationMin} minute.`;
  } else if (input.durationMinutes > ACTIVITY_LIMITS.durationMax) {
    e.durationMinutes = `Duration must be at most ${ACTIVITY_LIMITS.durationMax} minutes.`;
  }

  if (!input.effortLevel) e.effortLevel = "Effort level is required.";

  if (!Number.isFinite(input.pleasureScore)) e.pleasureScore = "Pleasure score is required.";
  if (
    input.pleasureScore < ACTIVITY_LIMITS.scoreMin ||
    input.pleasureScore > ACTIVITY_LIMITS.scoreMax
  ) {
    e.pleasureScore = `Pleasure score must be between ${ACTIVITY_LIMITS.scoreMin} and ${ACTIVITY_LIMITS.scoreMax}.`;
  }

  if (!Number.isFinite(input.satisfactionScore)) e.satisfactionScore = "Satisfaction score is required.";
  if (
    input.satisfactionScore < ACTIVITY_LIMITS.scoreMin ||
    input.satisfactionScore > ACTIVITY_LIMITS.scoreMax
  ) {
    e.satisfactionScore =
      `Satisfaction score must be between ${ACTIVITY_LIMITS.scoreMin} and ${ACTIVITY_LIMITS.scoreMax}.`;
  }

  if (!input.locationType) e.locationType = "Location type is required.";
  if (!input.socialType) e.socialType = "Social type is required.";
  if (!input.weatherCompatibility) e.weatherCompatibility = "Weather compatibility is required.";

  if (!Number.isFinite(input.minEnergy)) e.minEnergy = "Min energy is required.";
  if (
    input.minEnergy < ACTIVITY_LIMITS.energyMin ||
    input.minEnergy > ACTIVITY_LIMITS.energyMax
  ) {
    e.minEnergy = `Min energy must be between ${ACTIVITY_LIMITS.energyMin} and ${ACTIVITY_LIMITS.energyMax}.`;
  }

  if (!Number.isFinite(input.maxEnergy)) e.maxEnergy = "Max energy is required.";
  if (
    input.maxEnergy < ACTIVITY_LIMITS.energyMin ||
    input.maxEnergy > ACTIVITY_LIMITS.energyMax
  ) {
    e.maxEnergy = `Max energy must be between ${ACTIVITY_LIMITS.energyMin} and ${ACTIVITY_LIMITS.energyMax}.`;
  }

  if (Number.isFinite(input.minEnergy) && Number.isFinite(input.maxEnergy) && input.minEnergy > input.maxEnergy) {
    e.maxEnergy = "Max energy must be ≥ min energy.";
  }

  if (!Number.isFinite(input.minHealth)) e.minHealth = "Min health is required.";
  if (
    input.minHealth < ACTIVITY_LIMITS.healthMin ||
    input.minHealth > ACTIVITY_LIMITS.healthMax
  ) {
    e.minHealth = `Min health must be between ${ACTIVITY_LIMITS.healthMin} and ${ACTIVITY_LIMITS.healthMax}.`;
  }

  const tags = normalizeTags(tagsRaw);
  const unique = new Set(tags.map((t) => t.toLowerCase()));
  if (unique.size !== tags.length) e.tags = "Tags must be unique.";
  if (tags.some((t) => t.length > ACTIVITY_LIMITS.tagMaxLength)) {
    e.tags = `Each tag must be ≤ ${ACTIVITY_LIMITS.tagMaxLength} characters.`;
  }

  return e;
}

