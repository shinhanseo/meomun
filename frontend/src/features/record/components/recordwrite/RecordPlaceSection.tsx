import {
  NaverMapMarkerOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import type { SelectedPlaceInput } from '../../types/record.types';

interface RecordPlaceSectionProps {
  place: SelectedPlaceInput | null;
  onPressSelectPlace: () => void;
}

const DEFAULT_CAMERA = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 11,
};

export function RecordPlaceSection({
  place,
  onPressSelectPlace,
}: RecordPlaceSectionProps) {
  const mapRef = useRef<NaverMapViewRef>(null);
  const hasPlace = !!place;

  const camera = hasPlace
    ? {
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      zoom: 15,
    }
    : DEFAULT_CAMERA;

  useEffect(() => {
    if (!place) {
      return;
    }

    mapRef.current?.animateCameraTo({
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      zoom: 15,
      duration: 400,
    });
  }, [place]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPressSelectPlace}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MapPin color="#9B8BC0" size={22} strokeWidth={2} />
          <Text style={styles.label}>장소</Text>
        </View>

        <ChevronRight color="#8E849F" size={22} strokeWidth={2} />
      </View>

      <Text style={styles.placeName}>
        {hasPlace ? place.placeName : '지역을 선택해주세요'}
      </Text>

      <Text style={styles.address}>
        {hasPlace
          ? place.roadAddressName ?? place.addressName
          : '오늘은 어디에 머물렀나요?'}
      </Text>

      <View style={styles.mapPreview}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <NaverMapView
            ref={mapRef}
            style={styles.map}
            initialCamera={camera}
            customStyleId="ec1d6a8a-b6bc-4153-8878-570ecb4034f7"
            isShowCompass={false}
            isShowLocationButton={false}
            isShowScaleBar={false}
            isShowZoomControls={false}
            isScrollGesturesEnabled={false}
            isZoomGesturesEnabled={false}
            isTiltGesturesEnabled={false}
            isRotateGesturesEnabled={false}
          >
            {hasPlace && (
              <NaverMapMarkerOverlay
                latitude={Number(place.latitude)}
                longitude={Number(place.longitude)}
                width={30}
                height={38}
                anchor={{
                  x: 0.5,
                  y: 1,
                }}
                image={{
                  symbol: 'pink',
                }}
              />
            )}
          </NaverMapView>
        </View>

        {!hasPlace && (
          <View pointerEvents="none" style={styles.mapOverlay}>
            <View style={styles.mapBubble}>
              <Text style={styles.mapBubbleText}>
                지도를 눌러 장소를 선택하세요
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 18,
  },
  containerPressed: {
    opacity: 0.88,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  placeName: {
    color: semanticColor.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 6,
  },
  address: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  mapPreview: {
    backgroundColor: '#F4F0FA',
    borderRadius: 16,
    height: 180,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mapBubbleText: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
