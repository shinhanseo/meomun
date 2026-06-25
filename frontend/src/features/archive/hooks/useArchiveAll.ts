import { useInfiniteQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';
import type { ArchiveSort } from '../types/archive.types';

const ARCHIVE_PAGE_SIZE = 20;

export function useArchiveAll(sort: ArchiveSort = 'latest') {
  return useInfiniteQuery({
    queryKey: ['archive', 'all', sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      archiveApi.getAllArchive({
        cursor: pageParam,
        limit: ARCHIVE_PAGE_SIZE,
        sort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}