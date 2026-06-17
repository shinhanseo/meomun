import { database } from '../../db.js';

interface FindMonthlyRecordsOptions {
  startDate: Date;
  endDate: Date;
}

export class StatsRepository {
  findMonthlyRecords(userId: string, options: FindMonthlyRecordsOptions) {
    return database.record.findMany({
      where: {
        userId,
        recordedAt: {
          gte: options.startDate,
          lt: options.endDate,
        },
      },
      orderBy: [
        {
          recordedAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
      select: {
        id: true,
        emotion: true,
        recordedAt: true,
      },
    });
  }
}
