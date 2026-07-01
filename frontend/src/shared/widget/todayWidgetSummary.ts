import { emotionMeta, type EmotionCode } from '../constants/emotionMeta';

export type TodayWidgetSummary = {
  hasTodayRecord: boolean;
  emotionCode?: EmotionCode;
  emotionLabel?: string;
  emotionEmoji?: string;
  recordCount: number;
  latestPlaceName?: string;
  latestRecordId?: string;
  deepLink: string;
  updatedAt: string;
};

export const emptyTodayWidgetSummary = (): TodayWidgetSummary => ({
  hasTodayRecord: false,
  recordCount: 0,
  deepLink: 'meomun://record/new',
  updatedAt: new Date().toISOString(),
});

export function getTodayWidgetDeepLink(params: {
  recordCount: number;
  latestRecordId?: string;
}) {
  if (params.recordCount === 0) {
    return 'meomun://record/new';
  }

  if (params.recordCount === 1 && params.latestRecordId) {
    return `meomun://record/${params.latestRecordId}`;
  }

  return 'meomun://records/today';
}

type TodayRecordForWidget = {
  id: string;
  emotion: EmotionCode;
  recordedAt: string;
  placeName?: string;
};

export function buildTodayWidgetSummary(
  todayRecords: TodayRecordForWidget[],
): TodayWidgetSummary {
  if (todayRecords.length === 0) {
    return emptyTodayWidgetSummary();
  }

  const latestRecord = [...todayRecords].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )[0];

  const emotion = emotionMeta[latestRecord.emotion];

  return {
    hasTodayRecord: true,
    emotionCode: latestRecord.emotion,
    emotionLabel: emotion.label,
    recordCount: todayRecords.length,
    latestPlaceName: latestRecord.placeName,
    latestRecordId: latestRecord.id,
    deepLink: getTodayWidgetDeepLink({
      recordCount: todayRecords.length,
      latestRecordId: latestRecord.id,
    }),
    updatedAt: new Date().toISOString(),
  };
}

export function filterTodayWidgetRecords<T extends { recordedAt: string }>(
  records: T[],
  now = new Date(),
): T[] {
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const tomorrowStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  return records.filter((record) => {
    const recordedAt = new Date(record.recordedAt);

    return recordedAt >= todayStart && recordedAt < tomorrowStart;
  });
}