import { parseArchiveYearMonth } from '../archives/archives.query.js';
import { StatsRepository } from './stats.repository.js';

import type {
  DailyEmotionStats,
  EmotionStatsItem,
  HourlyStatsItem,
  MonthlyStatsQuery,
  MonthlyStatsResponse,
} from './stats.types.js';

import type { Emotion } from '../../generated/prisma/enums.js';

const KOREA_TIME_OFFSET_MS = 9 * 60 * 60 * 1000;

type MonthlyRecord = Awaited<
  ReturnType<StatsRepository['findMonthlyRecords']>
>[number];

export class StatsService {
  constructor(
    private readonly statsRepository = new StatsRepository(),
  ) { }

  async getMonthlyStats(
    userId: string,
    query: MonthlyStatsQuery,
  ): Promise<MonthlyStatsResponse> {
    const { yearMonth, startDate, endDate } = parseArchiveYearMonth(
      query.yearMonth,
    );

    const records = await this.statsRepository.findMonthlyRecords(userId, {
      startDate,
      endDate,
    });
    const totalRecordCount = records.length;
    const emotionDistribution = this.createEmotionDistribution(
      records,
      totalRecordCount,
    );
    const hourlyDistribution = this.createHourlyDistribution(
      records,
      totalRecordCount,
    );

    return {
      yearMonth,
      totalRecordCount,
      recordedDayCount: new Set(
        records.map((record) => this.formatDate(record.recordedAt)),
      ).size,
      topEmotion: emotionDistribution[0] ?? null,
      emotionDistribution,
      calendar: this.createCalendar(records),
      hourlyDistribution,
      peakHour: this.findPeakHour(hourlyDistribution),
    };
  }

  private createEmotionDistribution(
    records: MonthlyRecord[],
    totalRecordCount: number,
  ): EmotionStatsItem[] {
    const emotionCounts = new Map<Emotion, number>();

    records.forEach((record) => {
      emotionCounts.set(
        record.emotion,
        (emotionCounts.get(record.emotion) ?? 0) + 1,
      );
    });

    return Array.from(emotionCounts.entries())
      .map(([emotion, recordCount]) => ({
        emotion,
        recordCount,
        percentage: this.calculatePercentage(recordCount, totalRecordCount),
      }))
      .sort((a, b) => b.recordCount - a.recordCount);
  }

  private createCalendar(records: MonthlyRecord[]): DailyEmotionStats[] {
    const recordsByDate = new Map<string, MonthlyRecord[]>();

    records.forEach((record) => {
      const date = this.formatDate(record.recordedAt);

      recordsByDate.set(date, [
        ...(recordsByDate.get(date) ?? []),
        record,
      ]);
    });

    return Array.from(recordsByDate.entries())
      .map(([date, dailyRecords]) => {
        const emotions = this.createEmotionDistribution(
          dailyRecords,
          dailyRecords.length,
        );

        return {
          date,
          emotions,
          dominantEmotion: emotions[0]?.emotion ?? null,
          recordCount: dailyRecords.length,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private createHourlyDistribution(
    records: MonthlyRecord[],
    totalRecordCount: number,
  ): HourlyStatsItem[] {
    const hourCounts = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      recordCount: 0,
      percentage: 0,
    }));

    records.forEach((record) => {
      const hour = this.toKoreaTime(record.recordedAt).getUTCHours();
      hourCounts[hour].recordCount += 1;
    });

    return hourCounts.map((item) => ({
      ...item,
      percentage: this.calculatePercentage(
        item.recordCount,
        totalRecordCount,
      ),
    }));
  }

  private findPeakHour(
    hourlyDistribution: HourlyStatsItem[],
  ): HourlyStatsItem | null {
    const peakHour = hourlyDistribution.reduce<HourlyStatsItem | null>(
      (currentPeak, item) => {
        if (item.recordCount === 0) {
          return currentPeak;
        }

        if (!currentPeak || item.recordCount > currentPeak.recordCount) {
          return item;
        }

        return currentPeak;
      },
      null,
    );

    return peakHour;
  }

  private calculatePercentage(count: number, total: number): number {
    if (total === 0) {
      return 0;
    }

    return Math.round((count / total) * 100);
  }

  private formatDate(date: Date): string {
    return this.toKoreaTime(date).toISOString().slice(0, 10);
  }

  private toKoreaTime(date: Date): Date {
    return new Date(date.getTime() + KOREA_TIME_OFFSET_MS);
  }
}
