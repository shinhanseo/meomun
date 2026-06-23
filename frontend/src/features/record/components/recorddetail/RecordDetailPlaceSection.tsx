import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { MapPinIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { color } from '../../../../shared/constants/color';
import {
  emotionMarkerMeta,
  type EmotionType,
} from '../../../home/constants/emotionMarker';

type RecordDetailPlaceSectionProps = {
  placeName: string;
  address: string;
  roadAddress?: string | null;
  latitude: string;
  longitude: string;
  emotion: EmotionType;
};

export function RecordDetailPlaceSection({
  placeName,
  address,
  roadAddress,
  latitude,
  longitude,
  emotion,
}: RecordDetailPlaceSectionProps) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const markerImage = emotionMarkerMeta[emotion].image;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <MapPinIcon size={21} color={color.purple[500]} />
        <Text style={styles.sectionTitle}>기록된 장소</Text>
      </View>

      <View style={styles.mapCard}>
        <NaverMapView
          style={styles.map}
          initialCamera={{
            latitude: lat,
            longitude: lng,
            zoom: 12,
          }}
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
          <NaverMapMarkerOverlay
            latitude={lat}
            longitude={lng}
            width={56}
            height={70}
            anchor={{
              x: 0.5,
              y: 1,
            }}
            image={markerImage}
          />
        </NaverMapView>
      </View>

      <View style={styles.placeInfo}>
        <Text style={styles.placeName} numberOfLines={1}>
          {placeName}
        </Text>

        <Text style={styles.address} numberOfLines={2}>
          {address}
        </Text>

        {roadAddress ? (
          <Text style={styles.roadAddress} numberOfLines={2}>
            {roadAddress}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: color.purple[100],
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    color: color.purple[800],
    fontSize: 17,
    fontWeight: '700',
  },
  mapCard: {
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: color.purple[100],
  },
  map: {
    flex: 1,
  },
  placeInfo: {
    marginTop: 14,
  },
  placeName: {
    color: color.purple[600],
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 7,
  },
  address: {
    color: color.gray[700],
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  roadAddress: {
    color: color.gray[500],
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
    marginTop: 3,
  },
});