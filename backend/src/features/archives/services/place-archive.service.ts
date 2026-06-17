import { ArchivesMapper } from '../archives.mapper.js';
import {
  parseArchiveKeyword,
  parseArchiveLimit,
  parseArchiveSort,
} from '../archives.query.js';
import { resolveArchivePlaceCategory } from '../archives.place-category.js';
import { PlaceArchiveRepository } from '../repositories/place-archive.repository.js';

import type {
  ArchivePaginationQuery,
  ArchivePlaceCategory,
  PlaceCategoryArchiveDetailResponse,
  PlaceCategoryArchiveItem,
  PlaceCategoryArchiveResponse,
  PlaceCategoryArchiveStatsItem,
} from '../archives.types.js';

type PlaceCategoryRecord = Awaited<
  ReturnType<PlaceArchiveRepository['findPlaceCategoryRecords']>
>[number];

interface CategoryAggregate {
  recordCount: number;
  emotionCounts: Partial<Record<PlaceCategoryRecord['emotion'], number>>;
  thumbnailRecord: PlaceCategoryRecord | null;
}

export class PlaceArchiveService {
  constructor(
    private readonly placeArchiveRepository = new PlaceArchiveRepository(),
    private readonly archivesMapper = new ArchivesMapper(),
  ) { }

  async getPlaceCategoryArchive(
    userId: string,
  ): Promise<PlaceCategoryArchiveResponse> {
    const records =
      await this.placeArchiveRepository.findPlaceCategorySourceRecords(userId);

    const aggregates = this.groupRecordsByCategory(records);

    const stats: PlaceCategoryArchiveStatsItem[] = Array.from(
      aggregates.entries(),
      ([category, aggregate]) => ({
        category,
        recordCount: aggregate.recordCount,
      }),
    );

    const categories: PlaceCategoryArchiveItem[] = await Promise.all(
      Array.from(aggregates.entries(), async ([category, aggregate]) => ({
        category,
        recordCount: aggregate.recordCount,
        mostRecordedEmotion: this.findMostRecordedEmotion(
          aggregate.emotionCounts,
        ),
        thumbnailImage: aggregate.thumbnailRecord
          ? await this.archivesMapper.toArchiveThumbnailImage(
            aggregate.thumbnailRecord,
          )
          : null,
      })),
    );

    return {
      stats,
      categories,
    };
  }

  async getPlaceCategoryArchiveDetail(
    userId: string,
    category: ArchivePlaceCategory,
    query: ArchivePaginationQuery,
  ): Promise<PlaceCategoryArchiveDetailResponse> {
    const limit = parseArchiveLimit(query.limit);
    const sort = parseArchiveSort(query.sort);
    const keyword = parseArchiveKeyword(query.keyword);

    const records = await this.placeArchiveRepository.findPlaceCategoryRecords(
      userId,
      {
        keyword,
        sort,
      },
    );

    const categoryRecords = records.filter(
      (record) => this.resolveRecordCategory(record) === category,
    );
    const cursorIndex = query.cursor
      ? categoryRecords.findIndex((record) => record.id === query.cursor)
      : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const pageRecords = categoryRecords.slice(startIndex, startIndex + limit);
    const hasNextPage = startIndex + limit < categoryRecords.length;

    return {
      category,
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

  private groupRecordsByCategory(records: PlaceCategoryRecord[]) {
    const aggregates = new Map<ArchivePlaceCategory, CategoryAggregate>();

    records.forEach((record) => {
      const category = this.resolveRecordCategory(record);
      const existing = aggregates.get(category);
      const aggregate = existing ?? {
        recordCount: 0,
        emotionCounts: {},
        thumbnailRecord: null,
      };

      aggregate.recordCount += 1;
      aggregate.emotionCounts[record.emotion] =
        (aggregate.emotionCounts[record.emotion] ?? 0) + 1;

      if (!aggregate.thumbnailRecord && record.images.length > 0) {
        aggregate.thumbnailRecord = record;
      }

      aggregates.set(category, aggregate);
    });

    return aggregates;
  }

  private resolveRecordCategory(
    record: PlaceCategoryRecord,
  ): ArchivePlaceCategory {
    return resolveArchivePlaceCategory(
      record.place.categoryName,
      record.place.name,
    );
  }

  private findMostRecordedEmotion(
    emotionCounts: Partial<Record<PlaceCategoryRecord['emotion'], number>>,
  ) {
    const sortedEmotions = Object.entries(emotionCounts).sort(
      ([, countA], [, countB]) => countB - countA,
    );

    return sortedEmotions[0]?.[0] as PlaceCategoryRecord['emotion'] | null;
  }
}
