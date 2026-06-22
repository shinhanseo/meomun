import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import { StyleSheet, View } from 'react-native';

import { emotionMarkerMeta } from '../constants/emotionMarker';
import type { MapRecord } from '../types/home.types';

type HomeMapProps = {
  records: MapRecord[];
  selectedRecordId?: string | null;
  onPressRecord: (record: MapRecord) => void;
};

export function HomeMap({
  records,
  selectedRecordId,
  onPressRecord,
}: HomeMapProps) {
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
      >
        {records.map((record) => (
          <NaverMapMarkerOverlay
            key={record.id}
            latitude={Number(record.place.latitude)}
            longitude={Number(record.place.longitude)}
            width={record.id === selectedRecordId ? 90 : 78}
            height={record.id === selectedRecordId ? 106 : 92}
            image={emotionMarkerMeta[record.emotion].image}
            onTap={() => onPressRecord(record)}
          />
        ))}
      </NaverMapView>
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
