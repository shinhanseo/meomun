import { AppError } from '../../common/errors/app-error.js';
import { RecordsRepository } from './records.repository.js';
import { PlacesRepository } from '../places/places.repository.js';
import type { CreateRecordRequest, FindRecordsOptions, UpdateRecordData, UpdateRecordRequest } from './records.types.js';


export class RecordsService {
  constructor(
    private readonly recordsRepository = new RecordsRepository(),
    private readonly placesRepository = new PlacesRepository(),
  ) { }

  private parseRecordedAt(recordedAt: string): Date {
    const date = new Date(recordedAt);

    if (Number.isNaN(date.getTime())) {
      throw new AppError(400, 'recordedAt이 유효한 날짜가 아닙니다.');
    }

    return date;
  }

  private validateImageObjectKeys(objectKeys: string[]): void {
    if (objectKeys.length > 5) {
      throw new AppError(400, '사진은 최대 5장까지 등록할 수 있습니다.');
    }

    if (new Set(objectKeys).size !== objectKeys.length) {
      throw new AppError(400, '중복된 이미지가 포함되어 있습니다.');
    }
  }

  async createRecord(userId: string, request: CreateRecordRequest) {
    const recordedAt = this.parseRecordedAt(request.recordedAt);
    const imageObjectKeys = request.imageObjectKeys ?? [];

    this.validateImageObjectKeys(imageObjectKeys);

    const place = await this.placesRepository.upsertByKakaoPlaceId(
      request.place
    );

    return this.recordsRepository.createRecord({
      userId,
      placeId: place.id,
      emotion: request.emotion,
      content: request.content?.trim() || undefined,
      recordedAt,
      visibility: request.visibility,
      imageObjectKeys,
    });
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

    return record;
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

    return this.recordsRepository.findRecordsByUserId(userId, {
      limit,
      sort
    });
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

    this.validateImageObjectKeys(request.imageObjectKeys);

    const place = await this.placesRepository.upsertByKakaoPlaceId(
      request.place,
    );

    return this.recordsRepository.updateRecord(recordId, {
      placeId: place.id,
      emotion: request.emotion,
      content: request.content?.trim() || null,
      recordedAt,
      visibility: request.visibility,
      imageObjectKeys: request.imageObjectKeys,
    });
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
}
