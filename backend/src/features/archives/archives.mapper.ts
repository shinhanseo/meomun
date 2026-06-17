import { S3UploadProvider } from '../uploads/provider/s3-upload.provider.js';

import type {
  ArchiveThumbnailImage,
  ArchiveRecordListItem,
  MonthlyArchiveRecordItem,
} from './archives.types.js';

interface ArchiveRecordWithThumbnail {
  id: string;
  title: string;
  content: string | null;
  emotion: ArchiveRecordListItem['emotion'];
  recordedAt: Date;
  place: {
    name: string;
  };
  images: {
    objectKey: string;
  }[];
}

export class ArchivesMapper {
  constructor(
    private readonly s3UploadProvider = new S3UploadProvider(),
  ) { }

  async toArchiveRecordListItem(
    record: ArchiveRecordWithThumbnail,
  ): Promise<ArchiveRecordListItem> {
    const thumbnailImage = await this.createThumbnailImage(record);

    return {
      id: record.id,
      title: record.title,
      content: record.content,
      emotion: record.emotion,
      placeName: record.place.name,
      recordedAt: record.recordedAt.toISOString(),
      thumbnailImage,
    };
  }

  async toMonthlyArchiveRecordItem(
    record: ArchiveRecordWithThumbnail,
  ): Promise<MonthlyArchiveRecordItem> {
    const thumbnailImage = await this.createThumbnailImage(record);

    return {
      id: record.id,
      title: record.title,
      emotion: record.emotion,
      placeName: record.place.name,
      recordedAt: record.recordedAt.toISOString(),
      thumbnailImage,
    };
  }

  toArchiveThumbnailImage(
    record: ArchiveRecordWithThumbnail,
  ): Promise<ArchiveThumbnailImage | null> {
    return this.createThumbnailImage(record);
  }

  private async createThumbnailImage(record: ArchiveRecordWithThumbnail) {
    const thumbnail = record.images[0];

    if (!thumbnail) {
      return null;
    }

    return {
      objectKey: thumbnail.objectKey,
      imageUrl: await this.s3UploadProvider.createDownloadUrl(
        thumbnail.objectKey,
      ),
    };
  }
}
