import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { HomeHeader } from '../components/HomeHeader';
import { HomeMap } from '../components/HomeMap';
import { HomeRecordPanel } from '../components/HomeRecordPanel';
import { HomeEmptyPanel } from '../components/HomeEmptyPanel';
import { useMapRecords } from '../hooks/useMapRecords';
import type { MapRecord } from '../types/home.types';

type CurrentLocation = {
  latitude: number;
  longitude: number;
};

type HomeNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { data: records = [] } = useMapRecords();

  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MapRecord | null>(null);

  const latestRecord = useMemo(() => {
    return records
      .slice()
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() -
          new Date(a.recordedAt).getTime(),
      )[0];
  }, [records]);

  const panelRecord = selectedRecord ?? latestRecord;
  const panelMode = selectedRecord ? 'selected' : 'latest';

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
        onPressMap={() => setSelectedRecord(null)}
      />

      <HomeHeader />

      {panelRecord ? (
        <HomeRecordPanel
          mode={panelMode}
          record={panelRecord}
          onPressDetail={() => {
            navigation.navigate('RecordDetail', {
              recordId: panelRecord.id,
            });
          }}
        />
      ) : (
        <HomeEmptyPanel
          onPressCreate={() => {
            navigation.navigate('RecordWrite');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});