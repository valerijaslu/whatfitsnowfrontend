import type { CreateActivityRequest } from "@/api/activities";
import { ACTIVITY_LIMITS } from "@/pages/activityForm/activityFormConfig";
import type { ActivityFieldErrors } from "@/pages/activityForm/activityFormErrors";

const MIN_TEXT_LENGTH = 1;

export function validateActivity(input: CreateActivityRequest): ActivityFieldErrors {
  const e: ActivityFieldErrors = {};

  if (input.title.trim().length < MIN_TEXT_LENGTH) e.title = "Title is required.";
  if (input.title.trim().length > ACTIVITY_LIMITS.titleMax) {
    e.title = `Title must be at most ${ACTIVITY_LIMITS.titleMax} characters.`;
  }

  if (!Number.isFinite(input.minDurationMinutes) || input.minDurationMinutes < ACTIVITY_LIMITS.durationMin) {
    e.minDurationMinutes = `Min duration must be at least ${ACTIVITY_LIMITS.durationMin} minute.`;
  } else if (input.minDurationMinutes > ACTIVITY_LIMITS.durationMax) {
    e.minDurationMinutes = `Min duration must be at most ${ACTIVITY_LIMITS.durationMax} minutes.`;
  }

  if (!Number.isFinite(input.maxDurationMinutes) || input.maxDurationMinutes < ACTIVITY_LIMITS.durationMin) {
    e.maxDurationMinutes = `Max duration must be at least ${ACTIVITY_LIMITS.durationMin} minute.`;
  } else if (input.maxDurationMinutes > ACTIVITY_LIMITS.durationMax) {
    e.maxDurationMinutes = `Max duration must be at most ${ACTIVITY_LIMITS.durationMax} minutes.`;
  }

  if (
    Number.isFinite(input.minDurationMinutes) &&
    Number.isFinite(input.maxDurationMinutes) &&
    input.minDurationMinutes > input.maxDurationMinutes
  ) {
    e.maxDurationMinutes = "Max duration must be ≥ min duration.";
  }

  if (!input.effortLevel) e.effortLevel = "Effort level is required.";

  if (!input.locationType) e.locationType = "Location type is required.";
  if (!input.socialType) e.socialType = "Social type is required.";

  return e;
}

