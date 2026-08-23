import type { Development, DevelopmentFilters, DevelopmentPayload } from "../types/development.types";

type ApiResponse<T> = { success: boolean; message: string; data: T };

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) throw new Error(payload.message || "Development request failed");
  return payload.data;
}

export function getDevelopments(filters: DevelopmentFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  const query = params.toString();
  return request<Development[]>(`/api/developments${query ? `?${query}` : ""}`);
}

export function getDevelopment(id: string) { return request<Development>(`/api/developments/${id}`); }
export function createDevelopment(payload: DevelopmentPayload) {
  return request<Development>("/api/developments", { method: "POST", body: JSON.stringify(payload) });
}
export function updateDevelopment(id: string, payload: Partial<DevelopmentPayload>) {
  return request<Development>(`/api/developments/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}
export function deleteDevelopment(id: string) {
  return request<Development>(`/api/developments/${id}`, { method: "DELETE" });
}
