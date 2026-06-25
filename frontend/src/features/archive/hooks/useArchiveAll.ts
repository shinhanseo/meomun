import { useInfiniteQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';
import type { ArchiveSort } from '../types/archive.types';

const ARCHIVE_PAGE_SIZE = 20;

export function useArchiveAll(
  keyword: string,
  sort: ArchiveSort = 'latest',
) {
  const trimmedKeyword = keyword.trim();

  return useInfiniteQuery({
    queryKey: ['archive', 'all', trimmedKeyword, sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      archiveApi.getAllArchive({
        keyword: trimmedKeyword || undefined,
        cursor: pageParam,
        limit: ARCHIVE_PAGE_SIZE,
        sort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}