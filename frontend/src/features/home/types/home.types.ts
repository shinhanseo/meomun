export type EmotionType =
  | 'ANGRY'
  | 'ANXIOUS'
  | 'CALM'
  | 'FLUTTER'
  | 'HAPPY'
  | 'REFLECTIVE'
  | 'SAD'
  | 'TIRED';

export interface MapRecordThumbnailImage {
  objectKey: string;
  imageUrl: string;
}

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
  thumbnailImage: MapRecordThumbnailImage | null;
}