import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/homeApi";

export function useMapRecords() {
  return useQuery({
    queryKey: ['home', 'mapRecords'],
    queryFn: homeApi.getMapRecords,
  });
}