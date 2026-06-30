import { useInfiniteQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';
import type { ArchiveSort } from '../types';

const ARCHIVE_PAGE_SIZE = 20;

export function usePlaceArchiveDetail(
  placeId: string,
  keyword = '',
  sort: ArchiveSort = 'latest',
) {
  const trimmedKeyword = keyword.trim();

  return useInfiniteQuery({
    queryKey: ['archive', 'place', placeId, trimmedKeyword, sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      archiveApi.getPlaceArchiveDetail(placeId, {
        keyword: trimmedKeyword || undefined,
        cursor: pageParam,
        limit: ARCHIVE_PAGE_SIZE,
        sort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: placeId.length > 0,
  });
}
