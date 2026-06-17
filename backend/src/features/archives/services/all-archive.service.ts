import { ArchivesMapper } from '../archives.mapper.js';
import {
  parseArchiveKeyword,
  parseArchiveLimit,
  parseArchiveSort,
} from '../archives.query.js';
import { AllArchiveRepository } from '../repositories/all-archive.repository.js';

import type {
  AllArchiveResponse,
  ArchivePaginationQuery,
} from '../archives.types.js';

export class AllArchiveService {
  constructor(
    private readonly allArchiveRepository = new AllArchiveRepository(),
    private readonly archivesMapper = new ArchivesMapper(),
  ) { }

  async getAllArchive(
    userId: string,
    query: ArchivePaginationQuery,
  ): Promise<AllArchiveResponse> {
    const limit = parseArchiveLimit(query.limit);
    const sort = parseArchiveSort(query.sort);
    const keyword = parseArchiveKeyword(query.keyword);

    const [
      records,
      totalRecordCount,
      totalPlaceCount,
      mostRecordedEmotion,
      firstRecord,
      latestRecord,
    ] = await Promise.all([
      this.allArchiveRepository.findAllArchiveRecords(userId, {
        keyword,
        sort,
        limit: limit + 1,
        cursor: query.cursor,
      }),
      this.allArchiveRepository.countAllRecords(userId),
      this.allArchiveRepository.countDistinctPlaces(userId),
      this.allArchiveRepository.findMostRecordedEmotion(userId),
      this.allArchiveRepository.findFirstRecord(userId),
      this.allArchiveRepository.findLatestRecord(userId),
    ]);

    const hasNextPage = records.length > limit;
    const pageRecords = hasNextPage ? records.slice(0, limit) : records;

    return {
      stats: {
        totalRecordCount,
        totalPlaceCount,
        mostRecordedEmotion,
        firstRecordedAt: firstRecord?.recordedAt.toISOString() ?? null,
        latestRecordedAt: latestRecord?.recordedAt.toISOString() ?? null,
      },
      records: await Promise.all(
        pageRecords.map((record) =>
          this.archivesMapper.toArchiveRecordListItem(record),
        ),
      ),
      nextCursor: hasNextPage
        ? pageRecords[pageRecords.length - 1]?.id ?? null
        : null,
    };
  }
}
