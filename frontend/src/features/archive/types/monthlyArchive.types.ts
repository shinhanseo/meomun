import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type {
  ArchiveRecordListItem,
  ArchiveSort,
} from './archiveCommon.types';

export interface ArchiveMonthOption {
  year: number;
  month: number;
  recordCount: number;
}

export interface MonthlyArchiveEmotionStat {
  emotion: EmotionCode;
  count: number;
}

export interface MonthlyArchiveStats {
  year: number;
  month: number;
  totalRecordCount: number;
  mostRecordedEmotion: EmotionCode | null;
  emotionStats: MonthlyArchiveEmotionStat[];
}

export interface MonthlyArchiveRequestParams {
  year: number;
  month: number;
  keyword?: string;
  cursor?: string;
  limit?: number;
  sort?: ArchiveSort;
}

export interface MonthlyArchiveResponse {
  stats: MonthlyArchiveStats;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}
