import type {
  Emotion,
  Visibility,
} from '../../generated/prisma/enums.js';
import type { Prisma } from '../../generated/prisma/client.js';

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
  title: string;
  emotion: Emotion;
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
  imageUrl: string;
}

export interface RecordThumbnailImageResponse {
  objectKey: string;
  imageUrl: string;
}

export interface RecordResponse {
  id: string;
  title: string;
  emotion: Emotion;
  content: string | null;
  visibility: Visibility;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  place: RecordPlaceResponse;
  images: RecordImageResponse[];
}

export interface MapRecordResponse {
  id: string;
  title: string;
  content: string | null;
  emotion: Emotion;
  recordedAt: string;
  place: {
    latitude: string;
    longitude: string;
  };
  thumbnailImage: RecordThumbnailImageResponse | null;
}

export interface CreateRecordData {
  userId: string;
  placeId: string;
  title: string;
  emotion: Emotion;
  content?: string;
  recordedAt: Date;
  visibility?: Visibility;
  imageObjectKeys?: string[];
}

export interface UpdateRecordData {
  placeId: string;
  title?: string;
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

export interface UpdateRecordRequest {
  title: string;
  emotion: Emotion;
  content?: string | null;
  recordedAt: string;
  visibility: Visibility;
  place: SelectedPlaceInput;
  imageObjectKeys: string[];
}

export type RecordWithPlaceAndImages = Prisma.RecordGetPayload<{
  include: {
    place: true;
    images: true;
  };
}>;

export type MapRecordWithPlaceAndThumbnail = Prisma.RecordGetPayload<{
  include: {
    place: true;
    images: true;
  };
}>;
