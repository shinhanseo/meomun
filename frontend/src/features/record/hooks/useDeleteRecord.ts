import { useMutation, useQueryClient } from '@tanstack/react-query';

import { recordApi } from '../api/recordApi';

import {
  syncTodayWidgetSummary,
  syncTodayWidgetSummaryFromServer,
} from '../../../shared/widget/syncTodayWidgetSummary';

export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => recordApi.deleteRecord(recordId),
    onSuccess: async (_, recordId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['home', 'mapRecords'],
        }),
        queryClient.removeQueries({
          queryKey: ['record', 'detail', recordId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['record', 'placeSummary'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['stats'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['archive'],
        }),
      ]);

      await syncTodayWidgetSummary(queryClient, {
        removeRecordId: recordId,
      }).catch((error) => {
        console.warn('[today-widget:sync-after-delete-failed]', error);
      });
      await syncTodayWidgetSummaryFromServer(queryClient).catch(() => { });
    },
  });
}
