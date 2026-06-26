import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type { ArchiveThumbnailImage } from './archiveCommon.types';

export interface PlaceArchiveSummaryItem {
  kakaoPlaceId: string;
  placeName: string;
  recordCount: number;
  mostRecordedEmotion: EmotionCode | null;
  thumbnailImage: ArchiveThumbnailImage | null;
}
