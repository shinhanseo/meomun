import type { Emotion } from '../../generated/prisma/enums.js';

// Common
export type ArchiveSort = 'latest' | 'oldest';

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

export interface ArchivePaginationQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: number;
  cursor?: string;
}

export interface ArchiveThumbnailImage {
  objectKey: string;
  imageUrl: string;
}

export interface ArchiveRecordListItem {
  id: string;
  title: string;
  content: string | null;
  emotion: Emotion;
  placeName: string;
  recordedAt: string;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface ArchiveRecordListResponse {
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}

// All archive
export interface ArchiveOverviewStats {
  totalRecordCount: number;
  totalPlaceCount: number;
  mostRecordedEmotion: Emotion | null;
  firstRecordedAt: string | null;
  latestRecordedAt: string | null;
}

export interface AllArchiveResponse {
  stats: ArchiveOverviewStats;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}

// Monthly archive
export interface MonthlyArchiveQuery extends ArchivePaginationQuery {
  yearMonth: string; // YYYY-MM
}

export interface MonthlyArchiveRecordItem {
  id: string;
  title: string;
  emotion: Emotion;
  placeName: string;
  recordedAt: string;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface MonthlyArchiveEmotionCount {
  emotion: Emotion;
  recordCount: number;
}

export interface MonthlyArchiveResponse {
  yearMonth: string; // YYYY-MM
  emotionCounts: MonthlyArchiveEmotionCount[];
  records: MonthlyArchiveRecordItem[];
  nextCursor: string | null;
}

// Place category archive
export interface PlaceCategoryArchiveStatsItem {
  category: ArchivePlaceCategory;
  recordCount: number;
}

export interface PlaceCategoryArchiveItem {
  category: ArchivePlaceCategory;
  recordCount: number;
  mostRecordedEmotion: Emotion | null;
  thumbnailImage: ArchiveThumbnailImage | null;
}

export interface PlaceCategoryArchiveResponse {
  stats: PlaceCategoryArchiveStatsItem[];
  categories: PlaceCategoryArchiveItem[];
}

export interface PlaceCategoryArchiveDetailQuery extends ArchivePaginationQuery {
  category: ArchivePlaceCategory;
}

export interface PlaceCategoryArchiveDetailResponse {
  category: ArchivePlaceCategory;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}

// Emotion archive
export interface EmotionArchiveItem {
  emotion: Emotion;
  recordCount: number;
  percentage: number;
  isMostRecorded: boolean;
}

export interface EmotionArchiveResponse {
  totalRecordCount: number;
  emotions: EmotionArchiveItem[];
}

export interface EmotionArchiveDetailQuery extends ArchivePaginationQuery {
  emotion: Emotion;
}

export interface EmotionArchiveDetailResponse {
  emotion: Emotion;
  records: ArchiveRecordListItem[];
  nextCursor: string | null;
}
