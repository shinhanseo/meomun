import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { HomeHeader } from '../components/HomeHeader';
import { HomeMap } from '../components/HomeMap';
import { HomeEmotionFilter } from '../components/HomeEmotionFilter';
import { HomeRecordPanel } from '../components/HomeRecordPanel';
import { HomeEmptyPanel } from '../components/HomeEmptyPanel';
import { HomeFilterEmptyPanel } from '../components/HomeFilterEmptyPanel';
import { useMapRecords } from '../hooks/useMapRecords';
import type { MapRecord } from '../types/home.types';
import {
  emotionMeta,
  type EmotionCode,
} from '../../../shared/constants/emotionMeta';

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
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionCode | null>(
    null,
  );

  const filteredRecords = useMemo(() => {
    if (!selectedEmotion) {
      return records;
    }

    return records.filter((record) => record.emotion === selectedEmotion);
  }, [records, selectedEmotion]);

  const latestRecord = useMemo(() => {
    return filteredRecords
      .slice()
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() -
          new Date(a.recordedAt).getTime(),
      )[0];
  }, [filteredRecords]);

  const recordsByPlaceId = useMemo(() => {
    return filteredRecords.reduce((placeRecords, record) => {
      const recordsAtPlace = placeRecords.get(record.place.id) ?? [];
      recordsAtPlace.push(record);
      placeRecords.set(record.place.id, recordsAtPlace);

      return placeRecords;
    }, new Map<string, MapRecord[]>());
  }, [filteredRecords]);

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

    const selectedRecordExists = filteredRecords.some(
      (record) => record.id === selectedRecord.id,
    );

    if (!selectedRecordExists) {
      setSelectedRecord(null);
    }
  }, [filteredRecords, selectedRecord]);

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
        records={filteredRecords}
        currentLocation={currentLocation}
        selectedRecordId={selectedRecord?.id}
        onPressRecord={setSelectedRecord}
        onPressMap={() => setSelectedRecord(null)}
      />

      <HomeHeader />

      <HomeEmotionFilter
        selectedEmotion={selectedEmotion}
        onSelectEmotion={(emotion) => {
          setSelectedEmotion(emotion);
          setSelectedRecord(null);
        }}
      />

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
          onPressPlaceRecords={
            canShowNextRecord && selectedRecord
              ? () => {
                  navigation.navigate('PlaceArchiveDetail', {
                    placeId: selectedRecord.place.id,
                  });
                }
              : undefined
          }
          onPressDetail={() => {
            navigation.navigate('RecordDetail', {
              recordId: panelRecord.id,
            });
          }}
        />
      ) : records.length === 0 ? (
        <HomeEmptyPanel
          onPressCreate={() => {
            navigation.navigate('RecordWrite');
          }}
        />
      ) : selectedEmotion ? (
        <HomeFilterEmptyPanel
          emotionLabel={emotionMeta[selectedEmotion].label}
          onPressClear={() => setSelectedEmotion(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
