import { useMutation, useQueryClient } from '@tanstack/react-query';

import { recordApi } from '../api/recordApi';
import { uploadApi } from '../api/uploadApi';
import type { CreateRecordRequest } from '../types/record.types';
import type { SelectedRecordImage } from '../types/upload.types';

interface CreateRecordMutationVariables {
  record: Omit<CreateRecordRequest, 'imageObjectKeys'>;
  images: SelectedRecordImage[];
}

export function useCreateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ record, images }: CreateRecordMutationVariables) => {
      const imageObjectKeys = await uploadApi.uploadRecordImages(images);

      return recordApi.createRecord({
        ...record,
        imageObjectKeys,
      });
    },
    onSuccess: (createdRecord) => {
      queryClient.setQueryData(
        ['record', 'detail', createdRecord.id],
        createdRecord,
      );
      queryClient.invalidateQueries({ queryKey: ['home', 'mapRecords'] });
      queryClient.invalidateQueries({ queryKey: ['record', 'placeSummary'] });
    },
  });
}
