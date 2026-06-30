import { database } from '../../../db.js';
import { compareEmotionStats } from '../../../common/utils/emotion-order.js';

import type { ArchiveSort } from '../archives.types.js';

interface FindAllArchiveRecordsOptions {
  keyword?: string;
  sort: ArchiveSort;
  limit: number;
  cursor?: string;
}

export class AllArchiveRepository {
  findAllArchiveRecords(
    userId: string,
    options: FindAllArchiveRecordsOptions,
  ) {
    const orderDirection = options.sort === 'latest' ? 'desc' : 'asc';

    return database.record.findMany({
      where: {
        userId,
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

  countAllRecords(userId: string) {
    return database.record.count({
      where: {
        userId,
      },
    });
  }

  async countDistinctPlaces(userId: string): Promise<number> {
    const places = await database.record.groupBy({
      by: ['placeId'],
      where: {
        userId,
      },
    });

    return places.length;
  }

  async findMostRecordedEmotion(userId: string) {
    const result = await database.record.groupBy({
      by: ['emotion'],
      where: {
        userId,
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

    const sortedResult = result
      .map(({ emotion, _count }) => ({
        emotion,
        recordCount: _count.emotion,
      }))
      .sort(compareEmotionStats);

    return sortedResult[0]?.emotion ?? null;
  }

  findFirstRecord(userId: string) {
    return database.record.findFirst({
      where: {
        userId,
      },
      orderBy: {
        recordedAt: 'asc',
      },
      select: {
        recordedAt: true,
      },
    });
  }

  findLatestRecord(userId: string) {
    return database.record.findFirst({
      where: {
        userId,
      },
      orderBy: {
        recordedAt: 'desc',
      },
      select: {
        recordedAt: true,
      },
    });
  }
}
