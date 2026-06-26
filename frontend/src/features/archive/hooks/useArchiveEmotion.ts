import { useQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';

export function useEmotionArchive() {
  return useQuery({
    queryKey: ['archive', 'emotion'],
    queryFn: () => archiveApi.getEmotionArchive(),
  });
}