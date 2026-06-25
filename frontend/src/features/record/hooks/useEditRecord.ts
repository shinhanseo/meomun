import { useMutation, useQueryClient } from '@tanstack/react-query';

import { recordApi } from '../api/recordApi';
import type { CreateRecordRequest, RecordResponse } from '../types/record.types';

interface EditRecordMutationVariables {
  recordId: string;
  record: CreateRecordRequest;
}

export function useEditRecord() {
  const queryClient = useQueryClient();

  return useMutation<RecordResponse, Error, EditRecordMutationVariables>({
    mutationFn: ({ recordId, record }) => {
      return recordApi.editRecord(recordId, record);
    },
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(
        ['record', 'detail', updatedRecord.id],
        updatedRecord,
      );

      queryClient.invalidateQueries({ queryKey: ['home', 'mapRecords'] });
      queryClient.invalidateQueries({ queryKey: ['record', 'placeSummary'] });
    },
  });
}