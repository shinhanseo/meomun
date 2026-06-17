import { ArchivesMapper } from '../archives.mapper.js';
import {
  parseArchiveKeyword,
  parseArchiveLimit,
  parseArchiveSort,
  parseArchiveYearMonth,
} from '../archives.query.js';
import { MonthlyArchiveRepository } from '../repositories/monthly-archive.repository.js';

import type {
  MonthlyArchiveQuery,
  MonthlyArchiveResponse,
} from '../archives.types.js';

export class MonthlyArchiveService {
  constructor(
    private readonly monthlyArchiveRepository = new MonthlyArchiveRepository(),
    private readonly archivesMapper = new ArchivesMapper(),
  ) { }

  async getMonthlyArchive(
    userId: string,
    query: MonthlyArchiveQuery,
  ): Promise<MonthlyArchiveResponse> {
    const limit = parseArchiveLimit(query.limit);
    const sort = parseArchiveSort(query.sort);
    const keyword = parseArchiveKeyword(query.keyword);
    const { yearMonth, startDate, endDate } = parseArchiveYearMonth(
      query.yearMonth,
    );

    const [records, emotionCounts] = await Promise.all([
      this.monthlyArchiveRepository.findMonthlyArchiveRecords(userId, {
        startDate,
        endDate,
        keyword,
        sort,
        limit: limit + 1,
        cursor: query.cursor,
      }),
      this.monthlyArchiveRepository.findMonthlyEmotionCounts(userId, {
        startDate,
        endDate,
      }),
    ]);

    const hasNextPage = records.length > limit;
    const pageRecords = hasNextPage ? records.slice(0, limit) : records;

    return {
      yearMonth,
      emotionCounts: emotionCounts.map(({ emotion, _count }) => ({
        emotion,
        recordCount: _count.emotion,
      })),
      records: await Promise.all(
        pageRecords.map((record) =>
          this.archivesMapper.toMonthlyArchiveRecordItem(record),
        ),
      ),
      nextCursor: hasNextPage
        ? pageRecords[pageRecords.length - 1]?.id ?? null
        : null,
    };
  }
}
