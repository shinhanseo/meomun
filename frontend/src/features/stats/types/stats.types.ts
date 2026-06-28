import type { EmotionType } from '../../home/constants/emotionMarker';

export interface EmotionStatsItem {
  emotion: EmotionType;
  recordCount: number;
  percentage: number;
}

export interface DailyEmotionStats {
  date: string;
  emotions: EmotionStatsItem[];
  dominantEmotion: EmotionType | null;
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

