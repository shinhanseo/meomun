import type { Request, Response } from 'express';

import { AppError } from '../../common/errors/app-error.js';
import { Emotion } from '../../generated/prisma/enums.js';
import { AllArchiveService } from './services/all-archive.service.js';
import { EmotionArchiveService } from './services/emotion-archive.service.js';
import { MonthlyArchiveService } from './services/monthly-archive.service.js';
import { parseArchivePlaceCategoryParam } from './archives.place-category.js';
import { PlaceArchiveService } from './services/place-archive.service.js';
import type {
  ArchivePaginationQuery,
  ArchiveSort,
  MonthlyArchiveQuery,
} from './archives.types.js';

interface AllArchiveQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: string;
  cursor?: string;
}

interface EmotionArchiveDetailParams {
  emotion: Emotion;
}

interface EmotionArchiveDetailQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: string;
  cursor?: string;
}

interface PlaceCategoryArchiveDetailParams {
  category: string;
}

interface PlaceCategoryArchiveDetailQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: string;
  cursor?: string;
}

interface PlaceArchiveQuery {
  keyword?: string;
  sort?: ArchiveSort;
}

interface PlaceArchiveDetailParams {
  placeId: string;
}

interface PlaceArchiveDetailQuery {
  keyword?: string;
  sort?: ArchiveSort;
  limit?: string;
  cursor?: string;
}

interface MonthlyArchiveRequestQuery {
  yearMonth?: string;
  keyword?: string;
  sort?: ArchiveSort;
  limit?: string;
  cursor?: string;
}

export class ArchivesController {
  constructor(
    private readonly allArchiveService = new AllArchiveService(),
    private readonly emotionArchiveService = new EmotionArchiveService(),
    private readonly monthlyArchiveService = new MonthlyArchiveService(),
    private readonly placeArchiveService = new PlaceArchiveService(),
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

  getMonthlyArchive = async (
    request: Request<object, object, object, MonthlyArchiveRequestQuery>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const query: MonthlyArchiveQuery = {
      yearMonth: request.query.yearMonth ?? '',
      keyword: request.query.keyword,
      sort: request.query.sort,
      limit:
        request.query.limit === undefined
          ? undefined
          : Number(request.query.limit),
      cursor: request.query.cursor,
    };

    const result = await this.monthlyArchiveService.getMonthlyArchive(
      userId,
      query,
    );

    response.status(200).json(result);
  };

  getMonthOptions = async (
    request: Request,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const result = await this.monthlyArchiveService.getMonthOptions(userId);

    response.status(200).json(result);
  };

  getPlaceCategoryArchive = async (
    request: Request,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const result =
      await this.placeArchiveService.getPlaceCategoryArchive(userId);

    response.status(200).json(result);
  };

  getPlaceCategoryArchiveDetail = async (
    request: Request<
      PlaceCategoryArchiveDetailParams,
      object,
      object,
      PlaceCategoryArchiveDetailQuery
    >,
    response: Response,
  ) => {
    const userId = this.getUserId(request);
    const category = parseArchivePlaceCategoryParam(request.params.category);

    const query: ArchivePaginationQuery = {
      keyword: request.query.keyword,
      sort: request.query.sort,
      limit:
        request.query.limit === undefined
          ? undefined
          : Number(request.query.limit),
      cursor: request.query.cursor,
    };

    const result =
      await this.placeArchiveService.getPlaceCategoryArchiveDetail(
        userId,
        category,
        query,
      );

    response.status(200).json(result);
  };

  getPlaceArchive = async (
    request: Request<object, object, object, PlaceArchiveQuery>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const result = await this.placeArchiveService.getPlaceArchive(userId, {
      keyword: request.query.keyword,
      sort: request.query.sort,
    });

    response.status(200).json(result);
  };

  getPlaceArchiveDetail = async (
    request: Request<
      PlaceArchiveDetailParams,
      object,
      object,
      PlaceArchiveDetailQuery
    >,
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

    const result = await this.placeArchiveService.getPlaceArchiveDetail(
      userId,
      request.params.placeId,
      query,
    );

    response.status(200).json(result);
  };

  getEmotionArchive = async (
    request: Request,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const result = await this.emotionArchiveService.getEmotionArchive(userId);

    response.status(200).json(result);
  };

  getEmotionArchiveDetail = async (
    request: Request<
      EmotionArchiveDetailParams,
      object,
      object,
      EmotionArchiveDetailQuery
    >,
    response: Response,
  ) => {
    const userId = this.getUserId(request);
    const emotion = this.parseEmotion(request.params.emotion);

    const query: ArchivePaginationQuery = {
      keyword: request.query.keyword,
      sort: request.query.sort,
      limit:
        request.query.limit === undefined
          ? undefined
          : Number(request.query.limit),
      cursor: request.query.cursor,
    };

    const result = await this.emotionArchiveService.getEmotionArchiveDetail(
      userId,
      emotion,
      query,
    );

    response.status(200).json(result);
  };

  private parseEmotion(emotion: string): Emotion {
    if (!Object.values(Emotion).includes(emotion as Emotion)) {
      throw new AppError(400, '지원하지 않는 감정입니다.');
    }

    return emotion as Emotion;
  }

  private getUserId(request: { userId?: string }): string {
    if (!request.userId) {
      throw new AppError(401, '인증된 사용자 정보가 없습니다.');
    }

    return request.userId;
  }
}
