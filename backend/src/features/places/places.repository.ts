import { database } from '../../db.js';

import type { SelectedPlaceInput } from './places.types.js';

export class PlacesRepository {
  upsertByKakaoPlaceId(place: SelectedPlaceInput) {
    return database.place.upsert({
      where: {
        kakaoPlaceId: place.kakaoPlaceId,
      },
      create: {
        kakaoPlaceId: place.kakaoPlaceId,
        name: place.placeName,
        categoryName: place.categoryName,
        addressName: place.addressName,
        roadAddressName: place.roadAddressName,
        longitude: place.longitude,
        latitude: place.latitude,
      },
      update: {
        name: place.placeName,
        categoryName: place.categoryName,
        addressName: place.addressName,
        roadAddressName: place.roadAddressName,
        longitude: place.longitude,
        latitude: place.latitude,
      },
    });
  }
}