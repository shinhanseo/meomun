import {
  NaverMapView,
  type ClusterMarkerProp,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { emotionMarkerMeta } from '../constants/emotionMarker';
import type { MapRecord } from '../types/home.types';

type CurrentLocation = {
  latitude: number;
  longitude: number;
};

type HomeMapProps = {
  records: MapRecord[];
  currentLocation: CurrentLocation | null;
  selectedRecordId?: string | null;
  onPressRecord: (record: MapRecord) => void;
  onPressMap?: () => void;
};

const MARKER_WIDTH = 58;
const MARKER_HEIGHT = 78;

export function HomeMap({
  records,
  currentLocation,
  selectedRecordId,
  onPressRecord,
  onPressMap,
}: HomeMapProps) {
  const mapRef = useRef<NaverMapViewRef>(null);

  const recordById = useMemo(() => {
    return new Map(records.map((record) => [record.id, record]));
  }, [records]);

  const clusterMarkers = useMemo<ClusterMarkerProp[]>(() => {
    return records.map((record) => {
      const isSelected = record.id === selectedRecordId;

      return {
        identifier: record.id,
        latitude: Number(record.place.latitude),
        longitude: Number(record.place.longitude),
        width: isSelected ? 70 : MARKER_WIDTH,
        height: isSelected ? 92 : MARKER_HEIGHT,
        image: emotionMarkerMeta[record.emotion].image,
      };
    });
  }, [records, selectedRecordId]);

  const handlePressMarker = ({ markerIdentifier }: { markerIdentifier: string }) => {
    const record = recordById.get(markerIdentifier);

    if (!record) {
      return;
    }

    mapRef.current?.animateCameraTo({
      latitude: Number(record.place.latitude),
      longitude: Number(record.place.longitude),
      zoom: 12,
      duration: 400,
    });

    onPressRecord(record);
  };

  useEffect(() => {
    if (!currentLocation) {
      return;
    }

    mapRef.current?.animateCameraTo({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      zoom: 13,
      duration: 500,
    });
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapRef}
        style={styles.map}
        onTapMap={onPressMap}
        initialCamera={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 13,
        }}
        customStyleId="ec1d6a8a-b6bc-4153-8878-570ecb4034f7" // e559247a-fd67-42c6-937b-1d3ae0d97b27(보라색 지도)), 289a2f1a-3d46-4ce8-b607-b2f9ce380e3c(일반 지도))
        isShowLocationButton={false}
        clusters={[
          {
            markers: clusterMarkers,
            width: 58,
            height: 58,
            screenDistance: 90,
            minZoom: 0,
            maxZoom: 14,
            animate: true,
          },
        ]}
        onTapClusterLeaf={handlePressMarker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
