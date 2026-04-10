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
} from "@/api/activities";
import { ActivityForm, type ActivityFormValues } from "@/pages/activityForm/ActivityForm";
import { ACTIVITY_DEFAULTS, ACTIVITY_LIMITS } from "@/pages/activityForm/activityFormConfig";
import type { ActivityFieldErrors } from "@/pages/activityForm/activityFormErrors";
import { parseApiErrors } from "@/pages/activityForm/activityFormErrors";
import { clampInt, parseActivityId, parseIntOr } from "@/pages/activityForm/activityFormUtils";
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
    minDurationMinutes: String(ACTIVITY_LIMITS.durationMin),
    maxDurationMinutes: String(ACTIVITY_LIMITS.durationMin),
    effortLevel: ACTIVITY_DEFAULTS.effortLevel,
    locationType: ACTIVITY_DEFAULTS.locationType,
    socialType: ACTIVITY_DEFAULTS.socialType,
    isActive: ACTIVITY_DEFAULTS.isActive,
  });

  const [errors, setErrors] = useState<ActivityFieldErrors>({});

  const createDto: CreateActivityRequest = useMemo(
    () => ({
      title: values.title,
      minDurationMinutes: clampInt(
        parseIntOr(ACTIVITY_LIMITS.durationMin, values.minDurationMinutes),
        ACTIVITY_LIMITS.durationMin,
        ACTIVITY_LIMITS.durationMax,
      ),
      maxDurationMinutes: clampInt(
        parseIntOr(ACTIVITY_LIMITS.durationMin, values.maxDurationMinutes),
        ACTIVITY_LIMITS.durationMin,
        ACTIVITY_LIMITS.durationMax,
      ),
      effortLevel: values.effortLevel,
      locationType: values.locationType,
      socialType: values.socialType,
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
          minDurationMinutes: String(a.minDurationMinutes ?? ACTIVITY_LIMITS.durationMin),
          maxDurationMinutes: String(a.maxDurationMinutes ?? ACTIVITY_LIMITS.durationMin),
          effortLevel: (a.effortLevel ?? ACTIVITY_DEFAULTS.effortLevel) as EffortLevel,
          locationType: (a.locationType ?? ACTIVITY_DEFAULTS.locationType) as LocationType,
          socialType: (a.socialType ?? ACTIVITY_DEFAULTS.socialType) as SocialType,
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

    const local = validateActivity(createDto);
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

