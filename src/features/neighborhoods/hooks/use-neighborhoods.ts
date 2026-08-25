"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNeighborhood,
  deleteNeighborhood,
  getNeighborhood,
  getNeighborhoods,
  updateNeighborhood,
} from "../api/neighborhoods.api";
import type { NeighborhoodPayload } from "../types/neighborhood.types";
const key = ["neighborhoods"] as const;
export const useNeighborhoods = () =>
  useQuery({
    queryKey: key,
    queryFn: getNeighborhoods,
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
export const useNeighborhood = (id: string | null) =>
  useQuery({
    queryKey: [...key, id],
    queryFn: () => getNeighborhood(id!),
    enabled: Boolean(id),
  });
export function useCreateNeighborhood() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: createNeighborhood,
    onSuccess: () => query.refetchQueries({ queryKey: key }),
  });
}
export function useUpdateNeighborhood() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<NeighborhoodPayload>;
    }) => updateNeighborhood(id, payload),
    onSuccess: () => query.refetchQueries({ queryKey: key }),
  });
}
export function useDeleteNeighborhood() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: deleteNeighborhood,
    onSuccess: () => query.refetchQueries({ queryKey: key }),
  });
}
