import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HomeMap } from '../components/HomeMap';
import { useMapRecords } from '../hooks/useMapRecords';
import type { MapRecord } from '../types/home.types';

export function HomeScreen() {
  const { data: records = [] } = useMapRecords();
  const [selectedRecord, setSelectedRecord] = useState<MapRecord | null>(null);

  return (
    <View style={styles.container}>
      <HomeMap
        records={records}
        selectedRecordId={selectedRecord?.id}
        onPressRecord={setSelectedRecord}
      />

      {/* selectedRecord가 있으면 나중에 바텀시트 렌더링 */}
      {/* <RecordPreviewBottomSheet record={selectedRecord} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});