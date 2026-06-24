import { apiClient } from '../../../shared/api/client';
import type { PlaceSearchResponse } from '../types/place.types';

interface SearchPlacesParams {
  query: string;
  page?: number;
  size?: number;
}

export const placeApi = {
  async searchPlaces({ query, page = 1, size = 15 }: SearchPlacesParams) {
    const { data } = await apiClient.get<PlaceSearchResponse>(
      '/api/places/search',
      {
        params: {
          query,
          page,
          size,
        },
      },
    );

    return data;
  },
};
