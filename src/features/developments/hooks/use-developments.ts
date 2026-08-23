"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDevelopment, deleteDevelopment, getDevelopment, getDevelopments, updateDevelopment } from "../api/developments.api";
import type { DevelopmentFilters, DevelopmentPayload } from "../types/development.types";

const developmentKeys = {
  all: ["developments"] as const,
  detail: (id: string) => ["developments", id] as const,
};

export function useDevelopments(filters: DevelopmentFilters = {}) {
  return useQuery({ queryKey: [...developmentKeys.all, filters], queryFn: () => getDevelopments(filters) });
}
export function useDevelopment(id: string | null) {
  return useQuery({ queryKey: developmentKeys.detail(id ?? ""), queryFn: () => getDevelopment(id!), enabled: Boolean(id) });
}
export function useCreateDevelopment() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createDevelopment, onSuccess: () => queryClient.invalidateQueries({ queryKey: developmentKeys.all }) });
}
export function useUpdateDevelopment() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<DevelopmentPayload> }) => updateDevelopment(id, payload), onSuccess: (_, { id }) => { queryClient.invalidateQueries({ queryKey: developmentKeys.all }); queryClient.invalidateQueries({ queryKey: developmentKeys.detail(id) }); } });
}
export function useDeleteDevelopment() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteDevelopment, onSuccess: () => queryClient.invalidateQueries({ queryKey: developmentKeys.all }) });
}
