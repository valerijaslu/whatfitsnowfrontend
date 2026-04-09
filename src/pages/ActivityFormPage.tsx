import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createActivity,
  getActivity,
  updateActivity,
  type CreateActivityRequest,
  type EffortLevel,
  type LocationType,
  type SocialType,
  type UpdateActivityRequest,
  type WeatherCompatibility,
} from "@/api/activities";
import { ActivityForm, type ActivityFormValues } from "@/pages/activityForm/ActivityForm";
import { ACTIVITY_DEFAULTS, ACTIVITY_LIMITS } from "@/pages/activityForm/activityFormConfig";
import type { ActivityFieldErrors } from "@/pages/activityForm/activityFormErrors";
import { parseApiErrors } from "@/pages/activityForm/activityFormErrors";
import { clampInt, normalizeTags, parseActivityId, parseIntOr } from "@/pages/activityForm/activityFormUtils";
import { validateActivity } from "@/pages/activityForm/activityFormValidation";

export function ActivityFormPage({ mode }: { mode: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = mode === "edit";
  const activityId = isEdit ? parseActivityId(id) : null;

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [values, setValues] = useState<ActivityFormValues>({
    title: "",
    description: "",
    durationMinutes: String(ACTIVITY_LIMITS.durationMin),
    effortLevel: ACTIVITY_DEFAULTS.effortLevel,
    pleasureScore: String(ACTIVITY_LIMITS.scoreMin),
    satisfactionScore: String(ACTIVITY_LIMITS.scoreMin),
    locationType: ACTIVITY_DEFAULTS.locationType,
    socialType: ACTIVITY_DEFAULTS.socialType,
    weatherCompatibility: ACTIVITY_DEFAULTS.weatherCompatibility,
    minEnergy: String(ACTIVITY_LIMITS.energyMin),
    maxEnergy: String(ACTIVITY_LIMITS.energyMax),
    minHealth: String(ACTIVITY_LIMITS.healthMin),
    tagsRaw: "",
    isActive: ACTIVITY_DEFAULTS.isActive,
  });

  const [errors, setErrors] = useState<ActivityFieldErrors>({});

  const createDto: CreateActivityRequest = useMemo(
    () => ({
      title: values.title,
      description: values.description.trim() ? values.description : null,
      durationMinutes: clampInt(
        parseIntOr(ACTIVITY_LIMITS.durationMin, values.durationMinutes),
        ACTIVITY_LIMITS.durationMin,
        ACTIVITY_LIMITS.durationMax,
      ),
      effortLevel: values.effortLevel,
      pleasureScore: clampInt(
        parseIntOr(ACTIVITY_LIMITS.scoreMin, values.pleasureScore),
        ACTIVITY_LIMITS.scoreMin,
        ACTIVITY_LIMITS.scoreMax,
      ),
      satisfactionScore: clampInt(
        parseIntOr(ACTIVITY_LIMITS.scoreMin, values.satisfactionScore),
        ACTIVITY_LIMITS.scoreMin,
        ACTIVITY_LIMITS.scoreMax,
      ),
      locationType: values.locationType,
      socialType: values.socialType,
      weatherCompatibility: values.weatherCompatibility,
      minEnergy: clampInt(
        parseIntOr(ACTIVITY_LIMITS.energyMin, values.minEnergy),
        ACTIVITY_LIMITS.energyMin,
        ACTIVITY_LIMITS.energyMax,
      ),
      maxEnergy: clampInt(
        parseIntOr(ACTIVITY_LIMITS.energyMax, values.maxEnergy),
        ACTIVITY_LIMITS.energyMin,
        ACTIVITY_LIMITS.energyMax,
      ),
      minHealth: clampInt(
        parseIntOr(ACTIVITY_LIMITS.healthMin, values.minHealth),
        ACTIVITY_LIMITS.healthMin,
        ACTIVITY_LIMITS.healthMax,
      ),
      tags: normalizeTags(values.tagsRaw),
    }),
    [values],
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!isEdit) return;
      if (!activityId) {
        setErrors({ form: "Missing activity id in URL." });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrors({});
      try {
        const a = await getActivity(activityId);
        if (cancelled) return;
        setValues((prev) => ({
          ...prev,
          title: a.title ?? "",
          description: a.description ?? "",
          durationMinutes: String(a.durationMinutes ?? ACTIVITY_LIMITS.durationMin),
          effortLevel: (a.effortLevel ?? ACTIVITY_DEFAULTS.effortLevel) as EffortLevel,
          pleasureScore: String(a.pleasureScore ?? ACTIVITY_LIMITS.scoreMin),
          satisfactionScore: String(a.satisfactionScore ?? ACTIVITY_LIMITS.scoreMin),
          locationType: (a.locationType ?? ACTIVITY_DEFAULTS.locationType) as LocationType,
          socialType: (a.socialType ?? ACTIVITY_DEFAULTS.socialType) as SocialType,
          weatherCompatibility: (a.weatherCompatibility ?? ACTIVITY_DEFAULTS.weatherCompatibility) as WeatherCompatibility,
          minEnergy: String(a.minEnergy ?? ACTIVITY_LIMITS.energyMin),
          maxEnergy: String(a.maxEnergy ?? ACTIVITY_LIMITS.energyMax),
          minHealth: String(a.minHealth ?? ACTIVITY_LIMITS.healthMin),
          tagsRaw: (a.tags ?? []).join(", "),
          isActive: Boolean(a.isActive),
        }));
      } catch (err) {
        if (cancelled) return;
        setErrors(parseApiErrors(err));
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [activityId, isEdit]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const local = validateActivity(createDto, values.tagsRaw);
    if (Object.keys(local).length > 0) {
      setErrors(local);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEdit) {
        if (!activityId) throw new Error("Missing activity id in URL.");
        const updateDto: UpdateActivityRequest = { ...createDto, isActive: values.isActive };
        await updateActivity(activityId, updateDto);
      } else {
        await createActivity({ ...createDto, isActive: values.isActive });
      }
      navigate("/activities", { replace: true });
    } catch (err) {
      setErrors(parseApiErrors(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ActivityForm
      mode={mode}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      activityId={activityId}
      values={values}
      errors={errors}
      onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
      onSubmit={onSubmit}
    />
  );
}

