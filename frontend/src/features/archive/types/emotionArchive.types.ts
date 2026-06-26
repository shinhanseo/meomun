import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type { ArchiveThumbnailImage } from './archiveCommon.types';

export interface EmotionArchiveStat {
  emotion: EmotionCode;
  count: number;
  ratio: number;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface EmotionArchiveResponse {
  totalRecordCount: number;
  stats: EmotionArchiveStat[];
}
