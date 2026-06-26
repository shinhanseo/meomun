import { useInfiniteQuery } from '@tanstack/react-query';

import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import { archiveApi } from '../api/archiveApi';
import type { ArchiveSort } from '../types';

const ARCHIVE_PAGE_SIZE = 20;

export function useEmotionArchiveDetail(
  emotion: EmotionCode,
  keyword: string,
  sort: ArchiveSort = 'latest',
) {
  const trimmedKeyword = keyword.trim();

  return useInfiniteQuery({
    queryKey: ['archive', 'emotion', emotion, trimmedKeyword, sort],
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      archiveApi.getEmotionArchiveDetail(emotion, {
        keyword: trimmedKeyword || undefined,
        cursor: pageParam,
        limit: ARCHIVE_PAGE_SIZE,
        sort,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
