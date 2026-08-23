import type { Neighborhood, NeighborhoodPayload } from "../types/neighborhood.types";
type ApiResponse<T> = { success: boolean; message: string; data: T };
async function request<T>(path: string, init?: RequestInit) { const response = await fetch(path, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } }); const payload = await response.json() as ApiResponse<T>; if (!response.ok || !payload.success) throw new Error(payload.message || "Neighborhood request failed"); return payload.data; }
export const getNeighborhoods = () => request<Neighborhood[]>("/api/neighborhoods");
export const getNeighborhood = (id: string) => request<Neighborhood>(`/api/neighborhoods/${id}`);
export const createNeighborhood = (payload: NeighborhoodPayload) => request<Neighborhood>("/api/neighborhoods", { method: "POST", body: JSON.stringify(payload) });
export const updateNeighborhood = (id: string, payload: Partial<NeighborhoodPayload>) => request<Neighborhood>(`/api/neighborhoods/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteNeighborhood = (id: string) => request<Neighborhood>(`/api/neighborhoods/${id}`, { method: "DELETE" });
