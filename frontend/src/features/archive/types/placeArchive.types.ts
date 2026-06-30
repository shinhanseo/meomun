import type { EmotionCode } from '../../../shared/constants/emotionMeta';
import type {
  ArchiveRecordListItem,
  ArchiveSort,
  ArchiveThumbnailImage,
} from './archiveCommon.types';

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
  place: {
    id: string;
    placeName: string;
    addressName: string;
    roadAddressName: string | null;
  };
  recordCount: number;
  mostRecordedEmotion: EmotionCode | null;
  latestRecordedAt: string;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface PlaceArchiveRequestParams {
  keyword?: string;
  sort?: ArchiveSort;
}

export interface PlaceArchiveResponse {
  places: PlaceArchiveSummaryItem[];
}

export interface PlaceArchiveDetailRequestParams {
  keyword?: string;
  cursor?: string;
  limit?: number;
  sort?: ArchiveSort;
}

export interface PlaceArchiveDetailResponse {
  place: {
    id: string;
    placeName: string;
    addressName: string;
    roadAddressName: string | null;
    latitude: string;
    longitude: string;
  };
  recordCount: number;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}
