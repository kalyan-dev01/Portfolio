import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// A tiny allow-list based URL validator. Used before saving any
// admin-supplied URL so a broken or dangerous value never reaches
// the public site (see requirement 38, Security).
export function isSafeExternalUrl(url: string | null | undefined): boolean {
  if (!url) return true; // empty is fine, field is optional
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
