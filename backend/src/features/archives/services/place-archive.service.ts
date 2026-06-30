import { ArchivesMapper } from '../archives.mapper.js';
import { AppError } from '../../../common/errors/app-error.js';
import { compareEmotionByOrder } from '../../../common/utils/emotion-order.js';
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
  ArchiveSort,
  PlaceArchiveItem,
  PlaceArchiveResponse,
  PlaceArchiveDetailResponse,
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

interface PlaceAggregate {
  place: PlaceCategoryRecord['place'];
  recordCount: number;
  emotionCounts: Partial<Record<PlaceCategoryRecord['emotion'], number>>;
  latestRecordedAt: Date;
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

  async getPlaceArchive(
    userId: string,
    query: Pick<ArchivePaginationQuery, 'keyword' | 'sort'>,
  ): Promise<PlaceArchiveResponse> {
    const keyword = parseArchiveKeyword(query.keyword);
    const sort = parseArchiveSort(query.sort);
    const records = await this.placeArchiveRepository.findPlaceArchiveRecords(
      userId,
      {
        keyword,
      },
    );
    const aggregates = this.groupRecordsByPlace(records);
    const places = await Promise.all(
      Array.from(aggregates.values())
        .sort((placeA, placeB) => this.comparePlaceAggregates(placeA, placeB, sort))
        .map((aggregate): Promise<PlaceArchiveItem> => this.toPlaceArchiveItem(aggregate)),
    );

    return {
      places,
    };
  }

  async getPlaceArchiveDetail(
    userId: string,
    placeId: string,
    query: ArchivePaginationQuery,
  ): Promise<PlaceArchiveDetailResponse> {
    const trimmedPlaceId = placeId.trim();

    if (!trimmedPlaceId) {
      throw new AppError(400, 'placeId가 필요합니다.');
    }

    const limit = parseArchiveLimit(query.limit);
    const sort = parseArchiveSort(query.sort);
    const keyword = parseArchiveKeyword(query.keyword);

    const records = await this.placeArchiveRepository.findPlaceRecordsByPlaceId(
      userId,
      trimmedPlaceId,
      {
        keyword,
        sort,
      },
    );

    const firstRecord = records[0];

    if (!firstRecord) {
      throw new AppError(404, '이 장소에 남긴 기록을 찾을 수 없습니다.');
    }

    const cursorIndex = query.cursor
      ? records.findIndex((record) => record.id === query.cursor)
      : -1;
    const startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const pageRecords = records.slice(startIndex, startIndex + limit);
    const hasNextPage = startIndex + limit < records.length;

    return {
      place: {
        id: firstRecord.place.id,
        placeName: firstRecord.place.name,
        addressName: firstRecord.place.addressName,
        roadAddressName: firstRecord.place.roadAddressName,
        latitude: firstRecord.place.latitude.toString(),
        longitude: firstRecord.place.longitude.toString(),
      },
      recordCount: records.length,
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

  private groupRecordsByPlace(records: PlaceCategoryRecord[]) {
    const aggregates = new Map<string, PlaceAggregate>();

    records.forEach((record) => {
      const existing = aggregates.get(record.place.id);
      const aggregate = existing ?? {
        place: record.place,
        recordCount: 0,
        emotionCounts: {},
        latestRecordedAt: record.recordedAt,
        thumbnailRecord: null,
      };

      aggregate.recordCount += 1;
      aggregate.emotionCounts[record.emotion] =
        (aggregate.emotionCounts[record.emotion] ?? 0) + 1;

      if (record.recordedAt > aggregate.latestRecordedAt) {
        aggregate.latestRecordedAt = record.recordedAt;
      }

      if (!aggregate.thumbnailRecord && record.images.length > 0) {
        aggregate.thumbnailRecord = record;
      }

      aggregates.set(record.place.id, aggregate);
    });

    return aggregates;
  }

  private comparePlaceAggregates(
    placeA: PlaceAggregate,
    placeB: PlaceAggregate,
    sort: ArchiveSort,
  ) {
    const dateComparison =
      placeB.latestRecordedAt.getTime() - placeA.latestRecordedAt.getTime();

    if (dateComparison !== 0) {
      return sort === 'latest' ? dateComparison : -dateComparison;
    }

    return placeA.place.name.localeCompare(placeB.place.name);
  }

  private async toPlaceArchiveItem(
    aggregate: PlaceAggregate,
  ): Promise<PlaceArchiveItem> {
    return {
      place: {
        id: aggregate.place.id,
        placeName: aggregate.place.name,
        addressName: aggregate.place.addressName,
        roadAddressName: aggregate.place.roadAddressName,
      },
      recordCount: aggregate.recordCount,
      mostRecordedEmotion: this.findMostRecordedEmotion(
        aggregate.emotionCounts,
      ),
      latestRecordedAt: aggregate.latestRecordedAt.toISOString(),
      thumbnailImage: aggregate.thumbnailRecord
        ? await this.archivesMapper.toArchiveThumbnailImage(
          aggregate.thumbnailRecord,
        )
        : null,
    };
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
      ([emotionA, countA], [emotionB, countB]) => {
        if (countA !== countB) {
          return countB - countA;
        }

        return compareEmotionByOrder(
          emotionA as PlaceCategoryRecord['emotion'],
          emotionB as PlaceCategoryRecord['emotion'],
        );
      },
    );

    return sortedEmotions[0]?.[0] as PlaceCategoryRecord['emotion'] | null;
  }
}
