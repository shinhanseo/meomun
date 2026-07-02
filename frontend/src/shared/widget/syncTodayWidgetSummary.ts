import type { QueryClient } from '@tanstack/react-query';

import { homeApi } from '../../features/home/api/homeApi';
import type { MapRecord } from '../../features/home/types/home.types';
import type { RecordResponse } from '../../features/record/types/record.types';
import {
  buildTodayWidgetSummary,
  filterTodayWidgetRecords,
  type TodayRecordForWidget,
} from './todayWidgetSummary';
import { saveTodayWidgetSummary } from './todayWidgetBridge';

const todayWidgetRecordsQueryKey = ['todayWidget', 'records'] as const;

type SyncTodayWidgetSummaryOptions = {
  upsertRecord?: RecordResponse;
  removeRecordId?: string;
  records?: TodayRecordForWidget[];
};

type SyncTodayWidgetSummaryFromServerOptions = {
  upsertRecord?: RecordResponse;
};

export async function syncTodayWidgetSummary(
  queryClient: QueryClient,
  options: SyncTodayWidgetSummaryOptions = {},
) {
  let widgetRecords =
    options.records ?? getCachedTodayWidgetRecords(queryClient);

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

  queryClient.setQueryData(todayWidgetRecordsQueryKey, todayRecords);
  await saveTodayWidgetSummary(summary);
}

export async function syncTodayWidgetSummaryFromServer(
  queryClient: QueryClient,
  options: SyncTodayWidgetSummaryFromServerOptions = {},
) {
  const cachedWidgetRecords = getCachedTodayWidgetRecords(queryClient);
  const records = await homeApi.getMapRecords();
  queryClient.setQueryData(['home', 'mapRecords'], records);

  await syncTodayWidgetSummary(queryClient, {
    records: mapRecordsToTodayWidgetRecords(records, cachedWidgetRecords),
    upsertRecord: options.upsertRecord,
  });
}

function getCachedTodayWidgetRecords(
  queryClient: QueryClient,
): TodayRecordForWidget[] {
  const cachedWidgetRecords = queryClient.getQueryData<TodayRecordForWidget[]>(
    todayWidgetRecordsQueryKey,
  );

  if (cachedWidgetRecords) {
    return cachedWidgetRecords;
  }

  const cachedMapRecords =
    queryClient.getQueryData<MapRecord[]>(['home', 'mapRecords']) ?? [];

  return mapRecordsToTodayWidgetRecords(cachedMapRecords);
}

function mapRecordsToTodayWidgetRecords(
  records: MapRecord[],
  recordsWithPlaceName: TodayRecordForWidget[] = [],
): TodayRecordForWidget[] {
  const placeNameByRecordId = new Map(
    recordsWithPlaceName.map((record) => [record.id, record.placeName]),
  );

  return records.map((record) => ({
    id: record.id,
    emotion: record.emotion,
    recordedAt: record.recordedAt,
    placeName: placeNameByRecordId.get(record.id),
  }));
}
