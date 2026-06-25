import type { EmotionCode } from '../../../shared/constants/emotionMeta';

export type ArchiveSort = 'latest' | 'oldest';

export interface AllArchiveRequestParams {
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

export interface ArchiveThumbnailImage {
  objectKey: string;
  imageUrl: string;
}

export interface ArchiveRecordListItem {
  id: string;
  title: string;
  content: string | null;
  emotion: EmotionCode;
  placeName: string;
  recordedAt: string;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface AllArchiveResponse {
  stats: ArchiveOverviewStats;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}