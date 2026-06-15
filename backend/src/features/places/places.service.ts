import { AppError } from '../../common/errors/app-error.js';
import { KakaoLocalProvider } from './provider/kakao-local.provider.js';

import type {
  PlaceSearchQuery,
  PlaceSearchResponse,
} from './places.types.js';

export class PlacesService {
  constructor(
    private readonly kakaoLocalProvider = new KakaoLocalProvider(),
  ) { }

  async searchByKeyword(
    searchQuery: PlaceSearchQuery,
  ): Promise<PlaceSearchResponse> {
    const query = searchQuery.query?.trim();

    if (!query) {
      throw new AppError(400, '검색어가 필요합니다.');
    }

    const page = searchQuery.page ?? 1;
    const size = searchQuery.size ?? 15;

    if (!Number.isInteger(page) || page < 1 || page > 45) {
      throw new AppError(400, 'page는 1에서 45 사이의 정수여야 합니다.');
    }

    if (!Number.isInteger(size) || size < 1 || size > 15) {
      throw new AppError(400, 'size는 1에서 15 사이의 정수여야 합니다.');
    }

    return this.kakaoLocalProvider.searchByKeyword({
      query,
      page,
      size,
    })

  }
}
