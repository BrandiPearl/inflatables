import { slugify } from "@/lib/utils";

export type ActionState = { error?: string; success?: string } | null;

export function str(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function bool(form: FormData, key: string) {
  const value = form.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function lines(form: FormData, key: string) {
  return str(form, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function num(form: FormData, key: string): number | null {
  const raw = str(form, key);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function emptyToNull(value: string) {
  return value ? value : null;
}

export function slugFrom(form: FormData, nameKey = "name", slugKey = "slug") {
  return slugify(str(form, slugKey) || str(form, nameKey));
}
