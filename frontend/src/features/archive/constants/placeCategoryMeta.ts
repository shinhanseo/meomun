import type { ArchivePlaceCategory } from '../types';

export const ARCHIVE_PLACE_CATEGORIES = [
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

export const placeCategoryMeta: Record<
  ArchivePlaceCategory,
  {
    label: string;
    description: string;
    color: string;
  }
> = {
  HOME: {
    label: '집',
    description: '가장 편안한 공간에 남긴 감정들',
    color: '#A88BE8',
  },
  CAFE: {
    label: '카페',
    description: '차분히 머물렀던 카페의 순간들',
    color: '#D59A6F',
  },
  FOOD: {
    label: '음식점',
    description: '맛있는 시간과 함께 남은 감정들',
    color: '#F28B82',
  },
  NATURE: {
    label: '자연',
    description: '공원, 숲, 강가에서 머문 순간들',
    color: '#75C889',
  },
  CULTURE: {
    label: '문화',
    description: '전시, 영화, 공연과 함께한 감정들',
    color: '#8E9FE8',
  },
  SCHOOL: {
    label: '학교',
    description: '배움의 공간에 남겨진 기록들',
    color: '#F2C94C',
  },
  WORK: {
    label: '회사',
    description: '일과 하루 사이에 남은 감정들',
    color: '#7B8794',
  },
  SHOPPING: {
    label: '쇼핑',
    description: '상점과 거리에서 만난 순간들',
    color: '#F299C2',
  },
  STREET: {
    label: '거리',
    description: '길 위에서 스쳐간 감정들',
    color: '#8BC6EC',
  },
  OTHER: {
    label: '기타',
    description: '어느 분류에도 담기 어려운 순간들',
    color: '#B8B4C7',
  },
};