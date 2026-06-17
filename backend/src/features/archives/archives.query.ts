import { AppError } from '../../common/errors/app-error.js';

import type { ArchiveSort } from './archives.types.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const KOREA_TIME_OFFSET_MS = 9 * 60 * 60 * 1000;

export function parseArchiveKeyword(keyword?: string): string | undefined {
  return keyword?.trim() || undefined;
}

export function parseArchiveLimit(limit?: number): number {
  const parsedLimit = limit ?? DEFAULT_LIMIT;

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > MAX_LIMIT
  ) {
    throw new AppError(400, 'limit은 1에서 50 사이의 정수여야 합니다.');
  }

  return parsedLimit;
}

export function parseArchiveSort(sort?: ArchiveSort): ArchiveSort {
  const parsedSort = sort ?? 'latest';

  if (parsedSort !== 'latest' && parsedSort !== 'oldest') {
    throw new AppError(
      400,
      'sort는 latest 또는 oldest만 사용할 수 있습니다.',
    );
  }

  return parsedSort;
}

export function parseArchiveYearMonth(yearMonth?: string): {
  yearMonth: string;
  startDate: Date;
  endDate: Date;
} {
  if (!yearMonth || !/^\d{4}-\d{2}$/.test(yearMonth)) {
    throw new AppError(400, 'yearMonth는 YYYY-MM 형식이어야 합니다.');
  }

  const [year, month] = yearMonth.split('-').map(Number);

  if (month < 1 || month > 12) {
    throw new AppError(400, 'yearMonth의 월은 01에서 12 사이여야 합니다.');
  }

  return {
    yearMonth,
    startDate: new Date(Date.UTC(year, month - 1, 1) - KOREA_TIME_OFFSET_MS),
    endDate: new Date(Date.UTC(year, month, 1) - KOREA_TIME_OFFSET_MS),
  };
}
