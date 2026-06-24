export interface PlaceSearchResult {
  kakaoPlaceId: string;
  placeName: string;
  categoryName: string | null;
  addressName: string;
  roadAddressName: string;
  longitude: string;
  latitude: string;
}

export interface PlaceSearchResponse {
  meta: {
    totalCount: number;
    pageableCount: number;
    isEnd: boolean;
  };
  places: PlaceSearchResult[];
}
