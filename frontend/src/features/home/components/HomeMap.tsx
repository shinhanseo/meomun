import {
  NaverMapView,
  type ClusterMarkerProp,
} from '@mj-studio/react-native-naver-map';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { emotionMarkerMeta } from '../constants/emotionMarker';
import type { MapRecord } from '../types/home.types';

type HomeMapProps = {
  records: MapRecord[];
  selectedRecordId?: string | null;
  onPressRecord: (record: MapRecord) => void;
};

const MARKER_WIDTH = 78;
const MARKER_HEIGHT = 98;

export function HomeMap({
  records,
  selectedRecordId,
  onPressRecord,
}: HomeMapProps) {
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
        width: isSelected ? 90 : MARKER_WIDTH,
        height: isSelected ? 112 : MARKER_HEIGHT,
        image: emotionMarkerMeta[record.emotion].image,
      };
    });
  }, [records, selectedRecordId]);

  const handlePressMarker = ({ markerIdentifier }: { markerIdentifier: string }) => {
    const record = recordById.get(markerIdentifier);

    if (record) {
      onPressRecord(record);
    }
  };

  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 13,
        }}
        customStyleId="e559247a-fd67-42c6-937b-1d3ae0d97b27"
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