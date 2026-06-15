import { database } from '../../db.js';

import type { CreateRecordData, UpdateRecordData, FindRecordsOptions } from './records.types.js';

const recordInclude = {
  place: true,
  images: {
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
};

export class RecordsRepository {
  createRecord(record: CreateRecordData) {
    return database.record.create({
      data: {
        userId: record.userId,
        placeId: record.placeId,
        emotion: record.emotion,
        content: record.content,
        recordedAt: record.recordedAt,
        visibility: record.visibility,
        images: {
          create: record.imageObjectKeys?.map((objectKey, index) => ({
            objectKey,
            sortOrder: index,
          })),
        },
      },
      include: {
        place: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  findRecordById(recordId: string, userId: string) {
    return database.record.findFirst({
      where: {
        id: recordId,
        userId,
      },
      include: {
        place: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }

  findRecordsByUserId(
    userId: string,
    options: FindRecordsOptions = {},
  ) {
    const limit = options.limit ?? 20;
    const sort = options.sort ?? 'latest';

    return database.record.findMany({
      where: {
        userId,
      },
      take: limit,
      orderBy: {
        recordedAt: sort === 'latest' ? 'desc' : 'asc',
      },
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

  updateRecord(
    recordId: string,
    record: UpdateRecordData,
  ) {
    return database.$transaction(async (transaction) => {
      if (record.imageObjectKeys !== undefined) {
        await transaction.recordImage.deleteMany({
          where: {
            recordId,
          },
        });
      }

      return transaction.record.update({
        where: {
          id: recordId,
        },
        data: {
          emotion: record.emotion,
          content: record.content,
          recordedAt: record.recordedAt,
          visibility: record.visibility,
          images:
            record.imageObjectKeys === undefined
              ? undefined
              : {
                create: record.imageObjectKeys.map((objectKey, index) => ({
                  objectKey,
                  sortOrder: index,
                })),
              },
        },
        include: recordInclude,
      });
    });
  }

  deleteRecord(recordId: string) {
    return database.record.delete({
      where: {
        id: recordId,
      },
    });
  }
}
