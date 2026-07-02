import { useMutation, useQueryClient } from '@tanstack/react-query';

import { recordApi } from '../api/recordApi';
import { uploadApi } from '../api/uploadApi';
import type { CreateRecordRequest, RecordResponse } from '../types/record.types';
import type { EditableRecordImage } from '../types/upload.types';

import {
  syncTodayWidgetSummary,
  syncTodayWidgetSummaryFromServer,
} from '../../../shared/widget/syncTodayWidgetSummary';

interface EditRecordMutationVariables {
  recordId: string;
  record: Omit<CreateRecordRequest, 'imageObjectKeys'>;
  images: EditableRecordImage[];
}

export function useEditRecord() {
  const queryClient = useQueryClient();

  return useMutation<RecordResponse, Error, EditRecordMutationVariables>({
    mutationFn: async ({ recordId, record, images }) => {
      const newImages = images.filter((image) => image.type === 'new');
      const newImageObjectKeys = await uploadApi.uploadRecordImages(newImages);
      let newImageIndex = 0;

      const imageObjectKeys = images.map((image) => {
        if (image.type === 'existing') {
          return image.objectKey;
        }

        const objectKey = newImageObjectKeys[newImageIndex];
        newImageIndex += 1;

        return objectKey;
      });

      return recordApi.editRecord(recordId, {
        ...record,
        imageObjectKeys,
      });
    },
    onSuccess: async (updatedRecord) => {
      queryClient.setQueryData(
        ['record', 'detail', updatedRecord.id],
        updatedRecord,
      );

      queryClient.invalidateQueries({ queryKey: ['home', 'mapRecords'] });
      queryClient.invalidateQueries({ queryKey: ['record', 'placeSummary'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });

      await syncTodayWidgetSummary(queryClient, {
        upsertRecord: updatedRecord,
      }).catch((error) => {
        console.warn('[today-widget:sync-after-edit-failed]', error);
      });
      void syncTodayWidgetSummaryFromServer(queryClient, {
        upsertRecord: updatedRecord,
      }).catch(() => { });

    },
  });
}
