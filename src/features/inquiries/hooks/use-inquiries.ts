"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  budget: string;
  primaryGoal: string;
  timeline: string;
  message: string;
  status: "pending" | "completed";
  createdAt: string;
};
type R<T> = { success: boolean; message: string; data: T };
async function q<T>(path: string, init?: RequestInit) {
  const r = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    }),
    p = (await r.json()) as R<T>;
  if (!r.ok || !p.success) throw new Error(p.message);
  return p.data;
}
const key = ["contacts"] as const;
export const useInquiries = () =>
  useQuery({
    queryKey: key,
    queryFn: () => q<Inquiry[]>("/api/contacts"),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
export function useUpdateInquiry() {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Inquiry["status"] }) =>
      q<Inquiry>(`/api/contacts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => c.invalidateQueries({ queryKey: key }),
  });
}
export function useDeleteInquiry() {
  const c = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      q<Inquiry>(`/api/contacts/${id}`, { method: "DELETE" }),
    onSuccess: () => c.invalidateQueries({ queryKey: key }),
  });
}
