import { useQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';
import type { ArchiveSort } from '../types';

export function usePlaceArchive(
  keyword: string,
  sort: ArchiveSort = 'latest',
) {
  const trimmedKeyword = keyword.trim();

  return useQuery({
    queryKey: ['archive', 'places', trimmedKeyword, sort],
    queryFn: () =>
      archiveApi.getPlaceArchive({
        keyword: trimmedKeyword || undefined,
        sort,
      }),
  });
}
