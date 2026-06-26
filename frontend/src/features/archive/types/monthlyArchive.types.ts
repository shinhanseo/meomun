import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type {
  ArchiveThumbnailImage,
  ArchiveSort,
} from './archiveCommon.types';

export interface ArchiveMonthOption {
  year: number;
  month: number;
  recordCount: number;
}

export interface MonthlyArchiveEmotionCount {
  emotion: EmotionCode;
  recordCount: number;
}

export interface MonthlyArchiveRequestParams {
  yearMonth: string;
  keyword?: string;
  cursor?: string;
  limit?: number;
  sort?: ArchiveSort;
}

export interface MonthlyArchiveRecordItem {
  id: string;
  title: string;
  emotion: EmotionCode;
  placeName: string;
  recordedAt: string;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface MonthlyArchiveResponse {
  yearMonth: string;
  emotionCounts: MonthlyArchiveEmotionCount[];
  records: MonthlyArchiveRecordItem[];
  nextCursor: string | null;
}
