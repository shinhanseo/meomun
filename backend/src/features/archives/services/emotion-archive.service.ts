import { ArchivesMapper } from '../archives.mapper.js';
import {
  parseArchiveKeyword,
  parseArchiveLimit,
  parseArchiveSort,
} from '../archives.query.js';
import { EmotionArchiveRepository } from '../repositories/emotion-archive.repository.js';

import type { Emotion } from '../../../generated/prisma/enums.js';
import type {
  ArchivePaginationQuery,
  EmotionArchiveDetailResponse,
  EmotionArchiveResponse,
} from '../archives.types.js';

export class EmotionArchiveService {
  constructor(
    private readonly emotionArchiveRepository = new EmotionArchiveRepository(),
    private readonly archivesMapper = new ArchivesMapper(),
  ) { }

  async getEmotionArchive(userId: string): Promise<EmotionArchiveResponse> {
    const [totalRecordCount, emotionCounts] = await Promise.all([
      this.emotionArchiveRepository.countAllRecords(userId),
      this.emotionArchiveRepository.findEmotionCounts(userId),
    ]);

    const mostRecordedEmotion = emotionCounts[0]?.emotion ?? null;

    return {
      totalRecordCount,
      emotions: emotionCounts.map(({ emotion, _count }) => ({
        emotion,
        recordCount: _count.emotion,
        percentage: this.calculatePercentage(
          _count.emotion,
          totalRecordCount,
        ),
        isMostRecorded: emotion === mostRecordedEmotion,
      })),
    };
  }

  async getEmotionArchiveDetail(
    userId: string,
    emotion: Emotion,
    query: ArchivePaginationQuery,
  ): Promise<EmotionArchiveDetailResponse> {
    const limit = parseArchiveLimit(query.limit);
    const sort = parseArchiveSort(query.sort);
    const keyword = parseArchiveKeyword(query.keyword);

    const records =
      await this.emotionArchiveRepository.findEmotionArchiveRecords(userId, {
        emotion,
        keyword,
        sort,
        limit: limit + 1,
        cursor: query.cursor,
      });

    const hasNextPage = records.length > limit;
    const pageRecords = hasNextPage ? records.slice(0, limit) : records;

    return {
      emotion,
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

  private calculatePercentage(count: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Math.round((count / total) * 100);
  }
}