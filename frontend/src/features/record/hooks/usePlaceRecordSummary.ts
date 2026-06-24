import { useQuery } from '@tanstack/react-query';

import { recordApi } from '../api/recordApi';

export function usePlaceRecordSummary(kakaoPlaceId?: string) {
  return useQuery({
    queryKey: ['record', 'placeSummary', kakaoPlaceId],
    queryFn: () => recordApi.getPlaceRecordSummary(kakaoPlaceId ?? ''),
    enabled: !!kakaoPlaceId,
  });
}
