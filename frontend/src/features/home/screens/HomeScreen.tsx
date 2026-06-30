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

  const recordsByPlaceId = useMemo(() => {
    return records.reduce((placeRecords, record) => {
      const recordsAtPlace = placeRecords.get(record.place.id) ?? [];
      recordsAtPlace.push(record);
      placeRecords.set(record.place.id, recordsAtPlace);

      return placeRecords;
    }, new Map<string, MapRecord[]>());
  }, [records]);

  const selectedPlaceRecords = selectedRecord
    ? recordsByPlaceId.get(selectedRecord.place.id) ?? []
    : [];
  const selectedPlaceRecordIndex = selectedRecord
    ? selectedPlaceRecords.findIndex((record) => record.id === selectedRecord.id)
    : -1;

  const panelRecord = selectedRecord ?? latestRecord;
  const panelMode = selectedRecord ? 'selected' : 'latest';
  const canShowNextRecord =
    panelMode === 'selected' && selectedPlaceRecords.length > 1;

  const handlePressNextRecord = () => {
    if (!canShowNextRecord || selectedPlaceRecordIndex < 0) {
      return;
    }

    const nextIndex =
      (selectedPlaceRecordIndex + 1) % selectedPlaceRecords.length;

    setSelectedRecord(selectedPlaceRecords[nextIndex]);
  };

  useEffect(() => {
    if (!selectedRecord) {
      return;
    }

    const selectedRecordExists = records.some(
      (record) => record.id === selectedRecord.id,
    );

    if (!selectedRecordExists) {
      setSelectedRecord(null);
    }
  }, [records, selectedRecord]);

  useEffect(() => {
    let isMounted = true;

    const requestLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== 'granted') {
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        if (!isMounted) {
          return;
        }

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch {
      }
    };

    requestLocation();

    return () => {
      isMounted = false;
    };
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
          recordPosition={
            canShowNextRecord && selectedPlaceRecordIndex >= 0
              ? {
                  current: selectedPlaceRecordIndex + 1,
                  total: selectedPlaceRecords.length,
                }
              : undefined
          }
          onPressNextRecord={
            canShowNextRecord ? handlePressNextRecord : undefined
          }
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
