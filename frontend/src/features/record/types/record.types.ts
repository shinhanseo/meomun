import type { EmotionType } from '../../home/constants/emotionMarker';

export type Visibility = 'PUBLIC' | 'PRIVATE';

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
  emotion: EmotionType;
  content: string | null;
  visibility: Visibility;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  place: RecordPlaceResponse;
  images: RecordImageResponse[];
}

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
  emotion: EmotionType;
  content?: string;
  recordedAt: string;
  visibility?: Visibility;
  place: SelectedPlaceInput;
  imageObjectKeys?: string[];
}