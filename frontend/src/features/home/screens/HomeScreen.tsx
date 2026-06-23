import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { HomeMap } from '../components/HomeMap';
import { useMapRecords } from '../hooks/useMapRecords';
import type { MapRecord } from '../types/home.types';

type CurrentLocation = {
  latitude: number;
  longitude: number;
}

export function HomeScreen() {
  const { data: records = [] } = useMapRecords();
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MapRecord | null>(null);

  useEffect(() => {
    const requestLocation = async () => {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    requestLocation();
  }, []);

  return (
    <View style={styles.container}>
      <HomeMap
        records={records}
        currentLocation={currentLocation}
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