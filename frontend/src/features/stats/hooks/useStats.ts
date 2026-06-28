import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/statsApi";

export function useStats(yearMonth: string) {
  return useQuery({
    queryKey: ['stats', yearMonth],
    queryFn: () => statsApi.getStats(yearMonth),
  });
}