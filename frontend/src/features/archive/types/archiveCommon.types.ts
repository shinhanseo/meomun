import type { EmotionCode } from '../../../shared/constants/emotionMeta';

export type ArchiveSort = 'latest' | 'oldest';
export type ArchiveTab = 'all' | 'monthly' | 'place' | 'emotion';

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
