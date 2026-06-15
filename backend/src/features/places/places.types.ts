export interface PlaceSearchQuery {
  query: string;
  x?: string;
  y?: string;
  radius?: number;
  page?: number;
  size?: number;
}

export interface PlaceSearchResult {
  kakaoPlaceId: string;
  placeName: string;
  categoryName: string | null;
  addressName: string;
  roadAddressName: string;
  longitude: string;
  latitude: string;
}