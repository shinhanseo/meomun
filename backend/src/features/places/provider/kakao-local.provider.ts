import axios from 'axios';

import { AppError } from '../../../common/errors/app-error.js';
import type {
  PlaceSearchQuery,
  PlaceSearchResponse,
  PlaceSearchResult,
} from '../places.types.js';

interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface KakaoKeywordSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoPlaceDocument[];
}

export class KakaoLocalProvider {
  async searchByKeyword(
    searchQuery: PlaceSearchQuery,
  ): Promise<PlaceSearchResponse> {
    const restApiKey = process.env.KAKAO_REST_API_KEY;

    if (!restApiKey) {
      throw new AppError(500, 'KAKAO_REST_API_KEY가 설정되지 않았습니다.');
    }

    try {
      const response = await axios.get<KakaoKeywordSearchResponse>(
        'https://dapi.kakao.com/v2/local/search/keyword.json',
        {
          headers: {
            Authorization: `KakaoAK ${restApiKey}`,
          },
          params: {
            query: searchQuery.query,
            page: searchQuery.page,
            size: searchQuery.size,
          },
          timeout: 5000,
        },
      );

      return {
        meta: {
          totalCount: response.data.meta.total_count,
          pageableCount: response.data.meta.pageable_count,
          isEnd: response.data.meta.is_end,
        },
        places: response.data.documents.map((place) => ({
          kakaoPlaceId: place.id,
          placeName: place.place_name,
          categoryName: place.category_name || null,
          addressName: place.address_name,
          roadAddressName: place.road_address_name,
          longitude: place.x,
          latitude: place.y,
        })),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw new AppError(500, '카카오 REST API 키가 유효하지 않습니다.');
        }

        if (error.response?.status === 429) {
          throw new AppError(503, '카카오 장소 검색 요청 한도를 초과했습니다.');
        }
      }

      throw new AppError(502, '카카오 장소 검색에 실패했습니다.');
    }
  }
}



