import { AppError } from '../../common/errors/app-error.js';
import { RecordsRepository } from './records.repository.js';
import { PlacesRepository } from '../places/places.repository.js';
import { S3UploadProvider } from '../uploads/provider/s3-upload.provider.js';
import type {
  CreateRecordRequest,
  FindRecordsOptions,
  MapRecordResponse,
  MapRecordWithPlaceAndThumbnail,
  PlaceRecordSummaryResponse,
  RecordResponse,
  RecordWithPlaceAndImages,
  UpdateRecordRequest,
} from './records.types.js';

const MAX_TITLE_LENGTH = 40;

export class RecordsService {
  constructor(
    private readonly recordsRepository = new RecordsRepository(),
    private readonly placesRepository = new PlacesRepository(),
    private readonly s3UploadProvider = new S3UploadProvider(),
  ) { }

  private parseRecordedAt(recordedAt: string): Date {
    const date = new Date(recordedAt);

    if (Number.isNaN(date.getTime())) {
      throw new AppError(400, 'recordedAt이 유효한 날짜가 아닙니다.');
    }

    return date;
  }

  private validateImageObjectKeys(objectKeys: string[]): void {
    if (objectKeys.length > 3) {
      throw new AppError(400, '사진은 최대 3장까지 등록할 수 있습니다.');
    }

    if (new Set(objectKeys).size !== objectKeys.length) {
      throw new AppError(400, '중복된 이미지가 포함되어 있습니다.');
    }
  }

  private normalizeTitle(title: string): string {
    const trimmedTitle = title?.trim();

    if (!trimmedTitle) {
      throw new AppError(400, '제목을 입력해주세요.');
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      throw new AppError(400, '제목은 최대 40자까지 입력할 수 있습니다.');
    }

    return trimmedTitle;
  }

  async createRecord(userId: string, request: CreateRecordRequest) {
    const title = this.normalizeTitle(request.title);
    const recordedAt = this.parseRecordedAt(request.recordedAt);
    const imageObjectKeys = request.imageObjectKeys ?? [];

    this.validateImageObjectKeys(imageObjectKeys);

    const place = await this.placesRepository.upsertByKakaoPlaceId(
      request.place
    );

    const record = await this.recordsRepository.createRecord({
      userId,
      placeId: place.id,
      title,
      emotion: request.emotion,
      content: request.content?.trim() || undefined,
      recordedAt,
      visibility: request.visibility,
      imageObjectKeys,
    });

    return this.toRecordResponse(record);
  }

  async getRecordById(userId: string, recordId: string) {
    if (!recordId) {
      throw new AppError(400, '기록 id가 필요합니다.');
    }

    const record = await this.recordsRepository.findRecordById(
      recordId,
      userId,
    );

    if (!record) {
      throw new AppError(404, '기록을 찾을 수 없습니다.');
    }

    return this.toRecordResponse(record);
  }

  async getRecords(userId: string, options: FindRecordsOptions) {
    const limit = options.limit ?? 20;
    const sort = options.sort ?? 'latest';

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new AppError(400, 'limit은 1에서 50 사이의 정수여야 합니다.');
    }

    if (sort !== 'latest' && sort !== 'oldest') {
      throw new AppError(
        400,
        'sort는 latest 또는 oldest만 사용할 수 있습니다.',
      );
    }

    const records = await this.recordsRepository.findRecordsByUserId(userId, {
      limit,
      sort,
    });

    return Promise.all(
      records.map((record) => this.toRecordResponse(record)),
    );
  }

  async getMapRecords(userId: string) {
    const records = await this.recordsRepository.findMapRecordsByUserId(
      userId,
    );

    return Promise.all(
      records.map((record) => this.toMapRecordResponse(record)),
    );
  }

  async getPlaceRecordSummary(
    userId: string,
    kakaoPlaceId: string,
  ): Promise<PlaceRecordSummaryResponse> {
    const trimmedKakaoPlaceId = kakaoPlaceId?.trim();

    if (!trimmedKakaoPlaceId) {
      throw new AppError(400, 'kakaoPlaceId가 필요합니다.');
    }

    const summary = await this.recordsRepository.findPlaceRecordSummary(
      userId,
      trimmedKakaoPlaceId,
    );

    return {
      recordCount: summary.recordCount,
      latestRecord: summary.latestRecord
        ? {
          id: summary.latestRecord.id,
          emotion: summary.latestRecord.emotion,
          recordedAt: summary.latestRecord.recordedAt.toISOString(),
        }
        : null,
    };
  }

  async updateRecord(
    userId: string,
    recordId: string,
    request: UpdateRecordRequest,
  ) {
    const existingRecord = await this.recordsRepository.findRecordById(
      recordId,
      userId,
    );

    if (!existingRecord) {
      throw new AppError(404, '기록을 찾을 수 없습니다.');
    }

    const recordedAt = this.parseRecordedAt(request.recordedAt);
    const title = this.normalizeTitle(request.title);

    this.validateImageObjectKeys(request.imageObjectKeys);

    const place = await this.placesRepository.upsertByKakaoPlaceId(
      request.place,
    );

    const record = await this.recordsRepository.updateRecord(recordId, {
      placeId: place.id,
      title,
      emotion: request.emotion,
      content: request.content?.trim() || null,
      recordedAt,
      visibility: request.visibility,
      imageObjectKeys: request.imageObjectKeys,
    });

    return this.toRecordResponse(record);
  }

  async deleteRecord(userId: string, recordId: string) {
    const existingRecord = await this.recordsRepository.findRecordById(
      recordId,
      userId,
    );

    if (!existingRecord) {
      throw new AppError(404, '기록을 찾을 수 없습니다.');
    }

    return this.recordsRepository.deleteRecord(
      recordId,
    );
  }

  private async toRecordResponse(
    record: RecordWithPlaceAndImages,
  ): Promise<RecordResponse> {
    return {
      id: record.id,
      title: record.title,
      emotion: record.emotion,
      content: record.content,
      visibility: record.visibility,
      recordedAt: record.recordedAt.toISOString(),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      place: {
        id: record.place.id,
        kakaoPlaceId: record.place.kakaoPlaceId,
        placeName: record.place.name,
        categoryName: record.place.categoryName,
        addressName: record.place.addressName,
        roadAddressName: record.place.roadAddressName,
        longitude: record.place.longitude.toString(),
        latitude: record.place.latitude.toString(),
      },
      images: await Promise.all(
        record.images.map(async (image) => ({
          id: image.id,
          objectKey: image.objectKey,
          sortOrder: image.sortOrder,
          imageUrl: await this.s3UploadProvider.createDownloadUrl(
            image.objectKey,
          ),
        })),
      ),
    };
  }

  private async toMapRecordResponse(
    record: MapRecordWithPlaceAndThumbnail,
  ): Promise<MapRecordResponse> {
    const thumbnail = record.images[0];

    return {
      id: record.id,
      title: record.title,
      content: record.content,
      emotion: record.emotion,
      recordedAt: record.recordedAt.toISOString(),
      place: {
        id: record.place.id,
        latitude: record.place.latitude.toString(),
        longitude: record.place.longitude.toString(),
      },
      thumbnailImage: thumbnail
        ? {
          objectKey: thumbnail.objectKey,
          imageUrl: await this.s3UploadProvider.createDownloadUrl(
            thumbnail.objectKey,
          ),
        }
        : null,
    };
  }
}
