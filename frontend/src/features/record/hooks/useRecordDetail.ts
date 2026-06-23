import { useQuery } from "@tanstack/react-query";
import { recordApi } from "../api/recordApi";

export function useRecordDetail(recordId: string) {
  return useQuery({
    queryKey: ['record', 'detail', recordId],
    queryFn: () => recordApi.getRecordDetail(recordId),
    enabled: Boolean(recordId),
  });
}