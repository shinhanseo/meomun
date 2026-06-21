import type { Request, Response } from 'express';

import { AppError } from '../../common/errors/app-error.js';
import { RecordsService } from './records.service.js';

import type {
  CreateRecordRequest,
  FindRecordsOptions,
  RecordSort,
  UpdateRecordRequest,
} from './records.types.js';

interface RecordParams {
  recordId: string;
}

interface GetRecordsQuery {
  limit?: string;
  sort?: RecordSort;
}

export class RecordsController {
  constructor(
    private readonly recordsService = new RecordsService(),
  ) { }

  createRecord = async (
    request: Request<object, object, CreateRecordRequest>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const record = await this.recordsService.createRecord(
      userId,
      request.body,
    );

    response.status(201).json(record);
  };

  getRecordById = async (
    request: Request<RecordParams>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const record = await this.recordsService.getRecordById(
      userId,
      request.params.recordId,
    );

    response.status(200).json(record);
  };

  getRecords = async (
    request: Request<object, object, object, GetRecordsQuery>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const options: FindRecordsOptions = {
      limit:
        request.query.limit === undefined
          ? undefined
          : Number(request.query.limit),
      sort: request.query.sort,
    };

    const records = await this.recordsService.getRecords(userId, options);

    response.status(200).json(records);
  };

  getMapRecords = async (
    request: Request,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const records = await this.recordsService.getMapRecords(userId);

    response.status(200).json(records);
  };

  updateRecord = async (
    request: Request<RecordParams, object, UpdateRecordRequest>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const record = await this.recordsService.updateRecord(
      userId,
      request.params.recordId,
      request.body,
    );

    response.status(200).json(record);
  };

  deleteRecord = async (
    request: Request<RecordParams>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    await this.recordsService.deleteRecord(
      userId,
      request.params.recordId,
    );

    response.status(204).send();
  };

  private getUserId(request: { userId?: string }): string {
    if (!request.userId) {
      throw new AppError(401, '인증된 사용자 정보가 없습니다.');
    }

    return request.userId;
  }
}
