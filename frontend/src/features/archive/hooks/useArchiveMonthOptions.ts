import { useQuery } from '@tanstack/react-query';

import { archiveApi } from '../api/archiveApi';

export function useArchiveMonthOptions() {
  return useQuery({
    queryKey: ['archive', 'monthOptions'],
    queryFn: () => archiveApi.getArchiveMonthOptions(),
  });
}
