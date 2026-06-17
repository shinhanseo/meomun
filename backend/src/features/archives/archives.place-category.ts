import { AppError } from '../../common/errors/app-error.js';

import type { ArchivePlaceCategory } from './archives.types.js';

const ARCHIVE_PLACE_CATEGORIES = [
  'HOME',
  'CAFE',
  'FOOD',
  'NATURE',
  'CULTURE',
  'SCHOOL',
  'WORK',
  'SHOPPING',
  'STREET',
  'OTHER',
] as const satisfies readonly ArchivePlaceCategory[];

export function parseArchivePlaceCategoryParam(
  category: string,
): ArchivePlaceCategory {
  if (
    ARCHIVE_PLACE_CATEGORIES.includes(category as ArchivePlaceCategory)
  ) {
    return category as ArchivePlaceCategory;
  }

  throw new AppError(400, '지원하지 않는 장소 카테고리입니다.');
}

export function resolveArchivePlaceCategory(
  categoryName: string | null,
  placeName: string,
): ArchivePlaceCategory {
  const source = `${categoryName ?? ''} ${placeName}`.toLowerCase();

  if (includesAny(source, ['카페', '커피', 'coffee'])) {
    return 'CAFE';
  }

  if (
    includesAny(source, [
      '집',
      '아파트',
      '주택',
      '빌라',
      '오피스텔',
      '숙소',
      '호텔',
    ])
  ) {
    return 'HOME';
  }

  if (
    includesAny(source, [
      '공원',
      '산',
      '숲',
      '강',
      '호수',
      '해변',
      '바다',
      '자연',
      '캠핑',
    ])
  ) {
    return 'NATURE';
  }

  if (
    includesAny(source, [
      '도서관',
      '영화',
      '공연',
      '전시',
      '박물관',
      '미술관',
      '문화',
      '예술',
      '서점',
    ])
  ) {
    return 'CULTURE';
  }

  if (
    includesAny(source, [
      '음식점',
      '한식',
      '중식',
      '일식',
      '양식',
      '분식',
      '패스트푸드',
      '술집',
      '맛집',
      '식당',
      '레스토랑',
    ])
  ) {
    return 'FOOD';
  }

  if (includesAny(source, ['학교', '대학교', '학원', '캠퍼스'])) {
    return 'SCHOOL';
  }

  if (
    includesAny(source, ['회사', '오피스', '사무실', '업무', '비즈니스'])
  ) {
    return 'WORK';
  }

  if (
    includesAny(source, ['마트', '백화점', '쇼핑', '상가', '시장', '편의점'])
  ) {
    return 'SHOPPING';
  }

  if (
    includesAny(source, [
      '거리',
      '길',
      '도로',
      '산책로',
      '광장',
      '교량',
      '버스',
      '지하철',
      '역',
    ])
  ) {
    return 'STREET';
  }

  return 'OTHER';
}

function includesAny(source: string, keywords: string[]): boolean {
  return keywords.some((keyword) => source.includes(keyword));
}
