import axios from "axios";
import type { CreateActivityRequest } from "@/api/activities";

export type ActivityFieldErrors = Partial<Record<keyof CreateActivityRequest | "form", string>>;

export function parseApiErrors(err: unknown): ActivityFieldErrors {
  if (!axios.isAxiosError(err)) return { form: err instanceof Error ? err.message : "Request failed." };

  const data = err.response?.data as unknown;
  if (!data || typeof data !== "object") {
    return { form: err.message || "Request failed." };
  }

  const maybe = data as Record<string, unknown>;

  const fieldErrors = maybe.fieldErrors;
  if (fieldErrors && typeof fieldErrors === "object") {
    const fe = fieldErrors as Record<string, unknown>;
    const mapped: ActivityFieldErrors = {};
    for (const [k, v] of Object.entries(fe)) {
      if (typeof v === "string") mapped[k as keyof ActivityFieldErrors] = v;
    }
    if (typeof maybe.message === "string") mapped.form = maybe.message;
    return mapped;
  }

  const errors = maybe.errors;
  if (Array.isArray(errors)) {
    const mapped: ActivityFieldErrors = {};
    for (const item of errors) {
      if (item && typeof item === "object") {
        const rec = item as Record<string, unknown>;
        const field = typeof rec.field === "string" ? rec.field : null;
        const msg = typeof rec.message === "string" ? rec.message : null;
        if (field && msg) mapped[field as keyof ActivityFieldErrors] = msg;
      }
    }
    if (typeof maybe.message === "string") mapped.form = maybe.message;
    if (!mapped.form && typeof maybe.error === "string") mapped.form = maybe.error;
    return Object.keys(mapped).length ? mapped : { form: err.message || "Request failed." };
  }

  if (typeof maybe.message === "string") return { form: maybe.message };
  if (typeof maybe.error === "string") return { form: maybe.error };
  return { form: err.message || "Request failed." };
}

