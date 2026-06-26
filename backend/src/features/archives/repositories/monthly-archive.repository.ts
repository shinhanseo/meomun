import { database } from '../../../db.js';

import type { ArchiveSort } from '../archives.types.js';

interface FindMonthlyArchiveRecordsOptions {
  startDate: Date;
  endDate: Date;
  keyword?: string;
  sort: ArchiveSort;
  limit: number;
  cursor?: string;
}

interface FindMonthlyEmotionCountsOptions {
  startDate: Date;
  endDate: Date;
}

export class MonthlyArchiveRepository {
  findMonthlyArchiveRecordDates(userId: string) {
    return database.record.findMany({
      where: {
        userId,
      },
      select: {
        recordedAt: true,
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });
  }

  findMonthlyArchiveRecords(
    userId: string,
    options: FindMonthlyArchiveRecordsOptions,
  ) {
    const orderDirection = options.sort === 'latest' ? 'desc' : 'asc';

    return database.record.findMany({
      where: {
        userId,
        recordedAt: {
          gte: options.startDate,
          lt: options.endDate,
        },
        ...(options.keyword
          ? {
            OR: [
              { title: { contains: options.keyword, mode: 'insensitive' } },
              { content: { contains: options.keyword, mode: 'insensitive' } },
              {
                place: {
                  name: {
                    contains: options.keyword,
                    mode: 'insensitive',
                  },
                },
              },
              {
                place: {
                  addressName: {
                    contains: options.keyword,
                    mode: 'insensitive',
                  },
                },
              },
              {
                place: {
                  roadAddressName: {
                    contains: options.keyword,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
          : {}),
      },
      take: options.limit,
      ...(options.cursor
        ? {
          cursor: {
            id: options.cursor,
          },
          skip: 1,
        }
        : {}),
      orderBy: [
        {
          recordedAt: orderDirection,
        },
        {
          id: orderDirection,
        },
      ],
      include: {
        place: true,
        images: {
          take: 1,
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  findMonthlyEmotionCounts(
    userId: string,
    options: FindMonthlyEmotionCountsOptions,
  ) {
    return database.record.groupBy({
      by: ['emotion'],
      where: {
        userId,
        recordedAt: {
          gte: options.startDate,
          lt: options.endDate,
        },
      },
      _count: {
        emotion: true,
      },
      orderBy: {
        _count: {
          emotion: 'desc',
        },
      },
    });
  }
}
