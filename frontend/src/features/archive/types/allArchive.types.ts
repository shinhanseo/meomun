import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type {
  ArchiveRecordListItem,
  ArchiveSort,
} from './archiveCommon.types';

export interface AllArchiveRequestParams {
  keyword?: string;
  cursor?: string;
  limit?: number;
  sort?: ArchiveSort;
}

export interface ArchiveOverviewStats {
  totalRecordCount: number;
  totalPlaceCount: number;
  mostRecordedEmotion: EmotionCode | null;
  firstRecordedAt: string | null;
  latestRecordedAt: string | null;
}

export interface AllArchiveResponse {
  stats: ArchiveOverviewStats;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}
