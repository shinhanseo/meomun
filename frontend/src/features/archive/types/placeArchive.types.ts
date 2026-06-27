import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type { ArchiveThumbnailImage } from './archiveCommon.types';

export type ArchivePlaceCategory =
  | 'HOME'
  | 'CAFE'
  | 'FOOD'
  | 'NATURE'
  | 'CULTURE'
  | 'SCHOOL'
  | 'WORK'
  | 'SHOPPING'
  | 'STREET'
  | 'OTHER';

export interface PlaceArchiveSummaryItem {
  kakaoPlaceId: string;
  placeName: string;
  recordCount: number;
  mostRecordedEmotion: EmotionCode | null;
  thumbnailImage: ArchiveThumbnailImage | null;
}
