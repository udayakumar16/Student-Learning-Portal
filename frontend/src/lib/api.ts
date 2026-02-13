import { getTokenFromCookie } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE) {
  // eslint-disable-next-line no-console
  console.warn("Missing NEXT_PUBLIC_API_BASE_URL");
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? getTokenFromCookie() : null;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });
  } catch (err) {
    const base = API_BASE ?? "(missing NEXT_PUBLIC_API_BASE_URL)";
    const hint = `Network error while calling ${base}${path}. Is the backend running and CORS allowed?`;
    const message = err instanceof Error ? `${hint} (${err.message})` : hint;
    throw new Error(message);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message = (data && (data.error as string)) || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export type Subject = {
  _id: string;
  slug: string;
  label: string;
};

export async function fetchSubjects() {
  const data = await apiFetch<{ subjects: Subject[] }>("/api/subjects");
  return data.subjects;
}

export function subjectSlugToLabel(slug: string, subjects?: Subject[]): string {
  const found = subjects?.find((s) => s.slug === slug);
  return found?.label ?? slug;
}
