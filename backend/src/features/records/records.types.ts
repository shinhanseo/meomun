import type {
  Emotion,
  Visibility,
} from '../../generated/prisma/enums.js';

export interface SelectedPlaceInput {
  kakaoPlaceId: string;
  placeName: string;
  categoryName: string | null;
  addressName: string;
  roadAddressName: string | null;
  longitude: string;
  latitude: string;
}

export interface CreateRecordRequest {
  emtion: Emotion;
  content?: string;
  recordedAt: string;
  visibility?: Visibility;
  place: SelectedPlaceInput;
  imageObjectKeys?: string[];
}

export interface RecordPlaceResponse {
  id: string;
  kakaoPlaceId: string;
  placeName: string;
  categoryName: string | null;
  addressName: string;
  roadAddressName: string | null;
  longitude: string;
  latitude: string;
}

export interface RecordImageResponse {
  id: string;
  objectKey: string;
  sortOrder: number;
}

export interface RecordResponse {
  id: string;
  emotion: Emotion;
  content: string | null;
  visibility: Visibility;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  place: RecordPlaceResponse;
  images: RecordImageResponse[];
}

export interface CreateRecordData {
  userId: string;
  placeId: string;
  emotion: Emotion;
  content?: string;
  recordedAt: Date;
  visibility?: Visibility;
  imageObjectKeys?: string[];
}

export interface UpdateRecordData {
  emotion?: Emotion;
  content?: string | null;
  recordedAt?: Date;
  visibility?: Visibility;
  imageObjectKeys?: string[];
}

export type RecordSort = 'latest' | 'oldest';

export interface FindRecordsOptions {
  limit?: number;
  sort?: RecordSort;
}