import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type {
  ArchiveRecordListItem,
  ArchiveSort,
} from './archiveCommon.types';

export interface EmotionArchiveResponse {
  totalRecordCount: number;
  emotions: EmotionArchiveItem[];
}

export interface EmotionArchiveItem {
  emotion: EmotionCode;
  recordCount: number;
  percentage: number;
  isMostRecorded: boolean;
}

export interface EmotionArchiveDetailRequestParams {
  keyword?: string;
  cursor?: string;
  limit?: number;
  sort?: ArchiveSort;
}

export interface EmotionArchiveDetailResponse {
  emotion: EmotionCode;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}
