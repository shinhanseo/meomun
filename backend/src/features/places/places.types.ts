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

export interface KakaoPlaceDocument {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}