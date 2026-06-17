import { database } from '../../../db.js';

import type { Emotion } from '../../../generated/prisma/enums.js';
import type { ArchiveSort } from '../archives.types.js';

interface FindEmotionArchiveRecordsOptions {
  emotion: Emotion;
  keyword?: string;
  sort: ArchiveSort;
  limit: number;
  cursor?: string;
}

export class EmotionArchiveRepository {
  countAllRecords(userId: string) {
    return database.record.count({
      where: {
        userId,
      },
    });
  }

  findEmotionCounts(userId: string) {
    return database.record.groupBy({
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
  }

  async findEmotionThumbnailRecords(userId: string) {
    const emotionCounts = await this.findEmotionCounts(userId);

    return Promise.all(
      emotionCounts.map(async ({ emotion }) => {
        const record = await database.record.findFirst({
          where: {
            userId,
            emotion,
            images: {
              some: {},
            },
          },
          orderBy: {
            recordedAt: 'desc',
          },
          include: {
            images: {
              take: 1,
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        });

        return {
          emotion,
          record,
        };
      }),
    );
  }

  findEmotionArchiveRecords(
    userId: string,
    options: FindEmotionArchiveRecordsOptions,
  ) {
    const orderDirection = options.sort === 'latest' ? 'desc' : 'asc';

    return database.record.findMany({
      where: {
        userId,
        emotion: options.emotion,
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
}