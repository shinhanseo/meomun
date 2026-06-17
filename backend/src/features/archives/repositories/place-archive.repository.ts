import { database } from '../../../db.js';

import type { ArchiveSort } from '../archives.types.js';

interface FindPlaceCategoryRecordsOptions {
  keyword?: string;
  sort: ArchiveSort;
}

export class PlaceArchiveRepository {
  findPlaceCategorySourceRecords(userId: string) {
    return database.record.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          recordedAt: 'desc',
        },
        {
          id: 'desc',
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

  findPlaceCategoryRecords(
    userId: string,
    options: FindPlaceCategoryRecordsOptions,
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
