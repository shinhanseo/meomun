import { useInfiniteQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';
import type { ArchiveSort } from '../types';

const ARCHIVE_PAGE_SIZE = 20;

export function useArchiveMonthly(
  year: number,
  month: number,
  keyword: string,
  sort: ArchiveSort = 'latest',
) {
  const trimmedKeyword = keyword.trim();
  const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

  return useInfiniteQuery({
    queryKey: ['archive', 'monthly', yearMonth, trimmedKeyword, sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      archiveApi.getMonthlyArchive({
        yearMonth,
        keyword: trimmedKeyword || undefined,
        cursor: pageParam,
        limit: ARCHIVE_PAGE_SIZE,
        sort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
