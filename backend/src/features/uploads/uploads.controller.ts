import type { Request, Response } from 'express';

import { AppError } from '../../common/errors/app-error.js';
import { UploadsService } from './uploads.service.js';

import type { CreatePresignedUrlsRequest } from './uploads.types.js';

export class UploadsController {
  constructor(
    private readonly uploadService = new UploadsService(),
  ) { }

  createPresignedUrls = async (
    request: Request<object, object, CreatePresignedUrlsRequest>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const result = await this.uploadService.createPresignedUrls(
      userId,
      request.body,
    );

    response.status(201).json(result);
  }

  private getUserId(request: { userId?: string }): string {
    if (!request.userId) {
      throw new AppError(401, '인증된 사용자 정보가 없습니다.');
    }

    return request.userId;
  }

}