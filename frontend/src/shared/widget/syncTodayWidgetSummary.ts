import type { QueryClient } from '@tanstack/react-query';

import type { MapRecord } from '../../features/home/types/home.types';
import type { RecordResponse } from '../../features/record/types/record.types';
import {
  buildTodayWidgetSummary,
  filterTodayWidgetRecords,
  type TodayRecordForWidget,
} from './todayWidgetSummary';
import { saveTodayWidgetSummary } from './todayWidgetBridge';

type SyncTodayWidgetSummaryOptions = {
  upsertRecord?: RecordResponse;
  removeRecordId?: string;
};

export async function syncTodayWidgetSummary(
  queryClient: QueryClient,
  options: SyncTodayWidgetSummaryOptions = {},
) {
  const cachedRecords =
    queryClient.getQueryData<MapRecord[]>(['home', 'mapRecords']) ?? [];

  let widgetRecords: TodayRecordForWidget[] = cachedRecords.map((record) => ({
    id: record.id,
    emotion: record.emotion,
    recordedAt: record.recordedAt,
  }));

  if (options.removeRecordId) {
    widgetRecords = widgetRecords.filter(
      (record) => record.id !== options.removeRecordId,
    );
  }

  if (options.upsertRecord) {
    const nextRecord: TodayRecordForWidget = {
      id: options.upsertRecord.id,
      emotion: options.upsertRecord.emotion,
      recordedAt: options.upsertRecord.recordedAt,
      placeName: options.upsertRecord.place.placeName,
    };

    widgetRecords = [
      ...widgetRecords.filter((record) => record.id !== nextRecord.id),
      nextRecord,
    ];
  }

  const todayRecords = filterTodayWidgetRecords(widgetRecords);
  const summary = buildTodayWidgetSummary(todayRecords);

  await saveTodayWidgetSummary(summary);
}