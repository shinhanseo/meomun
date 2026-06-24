import { useQuery } from '@tanstack/react-query';

import { placeApi } from '../api/placeApi';

export function useSearchPlaces(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ['places', 'search', trimmedQuery],
    queryFn: () => placeApi.searchPlaces({ query: trimmedQuery }),
    enabled: trimmedQuery.length > 0,
  });
}
