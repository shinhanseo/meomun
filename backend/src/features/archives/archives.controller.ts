import type { Request, Response } from 'express';

import { AppError } from '../../common/errors/app-error.js';
import { AllArchiveService } from './services/all-archive.service.js';

import type {
  ArchivePaginationQuery,
  ArchiveSort,
} from './archives.types.js';

interface AllArchiveQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: string;
  cursor?: string;
}

export class ArchivesController {
  constructor(
    private readonly allArchiveService = new AllArchiveService(),
  ) { }

  getAllArchive = async (
    request: Request<object, object, object, AllArchiveQuery>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const query: ArchivePaginationQuery = {
      keyword: request.query.keyword,
      sort: request.query.sort,
      limit:
        request.query.limit === undefined
          ? undefined
          : Number(request.query.limit),
      cursor: request.query.cursor,
    };

    const result = await this.allArchiveService.getAllArchive(userId, query);

    response.status(200).json(result);
  };

  private getUserId(request: { userId?: string }): string {
    if (!request.userId) {
      throw new AppError(401, '인증된 사용자 정보가 없습니다.');
    }

    return request.userId;
  }
}
