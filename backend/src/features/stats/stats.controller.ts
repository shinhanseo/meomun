import type { Request, Response } from 'express';

import { AppError } from '../../common/errors/app-error.js';
import { StatsService } from './stats.service.js';

interface MonthlyStatsRequestQuery {
  yearMonth?: string;
}

export class StatsController {
  constructor(
    private readonly statsService = new StatsService(),
  ) { }

  getMonthlyStats = async (
    request: Request<object, object, object, MonthlyStatsRequestQuery>,
    response: Response,
  ) => {
    const userId = this.getUserId(request);

    const result = await this.statsService.getMonthlyStats(userId, {
      yearMonth: request.query.yearMonth ?? '',
    });

    response.status(200).json(result);
  };

  private getUserId(request: { userId?: string }): string {
    if (!request.userId) {
      throw new AppError(401, '인증된 사용자 정보가 없습니다.');
    }

    return request.userId;
  }
}
