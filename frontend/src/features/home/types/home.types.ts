import type { EmotionType } from '../constants/emotionMarker';

export interface MapRecord {
  id: string;
  title: string;
  content: string | null;
  emotion: EmotionType;
  recordedAt: string;
  place: {
    latitude: string;
    longitude: string;
  };
  thumbnailImage: {
    objectKey: string;
    imageUrl: string;
  } | null;
}