import type { Emotion } from '../../generated/prisma/enums.js';

export interface MonthlyStatsQuery {
  yearMonth: string;
}

export interface EmotionStatsItem {
  emotion: Emotion;
  recordCount: number;
  percentage: number;
}

export interface DailyEmotionStats {
  date: string;
  emotions: EmotionStatsItem[];
  dominantEmotion: Emotion | null;
  recordCount: number;
}

export interface HourlyStatsItem {
  hour: number;
  recordCount: number;
  percentage: number;
}

export interface MonthlyStatsResponse {
  yearMonth: string;
  totalRecordCount: number;
  recordedDayCount: number;
  topEmotion: EmotionStatsItem | null;
  emotionDistribution: EmotionStatsItem[];
  calendar: DailyEmotionStats[];
  hourlyDistribution: HourlyStatsItem[];
  peakHour: HourlyStatsItem | null;
}
