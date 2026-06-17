import type { Emotion } from '../../generated/prisma/enums.js';
import type { RecordResponse } from '../records/records.types.js';

export type ArchiveSort = 'latest' | 'oldest';

export interface ArchiveRecordsQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: number;
  cursor?: string;
  yearMonth?: string;
  placeId?: string;
  emotion?: Emotion;
}

export interface ArchiveRecordsResponse {
  records: RecordResponse[];
  nextCursor: string | null;
}

export interface ArchiveYearMonthGroup {
  yearMonth: string;
  recordCount: number;
}

export interface ArchiveYearMonthGroupsResponse {
  yearMonths: ArchiveYearMonthGroup[];
}

export interface ArchivePlaceGroup {
  placeId: string;
  placeName: string;
  categoryName: string | null;
  primaryCategory: string | null;
  addressName: string;
  recordCount: number;
}

export interface ArchivePlaceGroupsResponse {
  places: ArchivePlaceGroup[];
}

export interface ArchiveEmotionGroup {
  emotion: Emotion;
  recordCount: number;
}

export interface ArchiveEmotionGroupsResponse {
  emotions: ArchiveEmotionGroup[];
}