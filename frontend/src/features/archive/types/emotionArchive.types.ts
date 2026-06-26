import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type { ArchiveThumbnailImage } from './archiveCommon.types';

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
