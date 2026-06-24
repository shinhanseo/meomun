import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../shared/constants/color';
import { useRecordWriteStore } from '../../record/store/recordWriteStore';
import { PlaceSearchBar } from '../components/PlaceSearchBar';
import { PlaceSearchResultItem } from '../components/PlaceSearchResultItem';
import { useSearchPlaces } from '../hooks/useSearchPlaces';
import type { PlaceSearchResult } from '../types/place.types';

type PlaceSelectNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'PlaceSelect'
>;

export function PlaceSelectScreen() {
  const navigation = useNavigation<PlaceSelectNavigationProp>();
  const setPlace = useRecordWriteStore((state) => state.setPlace);

  const [query, setQuery] = useState('');
  const { data, isError, isFetching } = useSearchPlaces(query);

  const places = data?.places ?? [];
  const trimmedQuery = query.trim();

  const handlePressBack = () => {
    navigation.goBack();
  };

  const handleClearQuery = () => {
    setQuery('');
  };

  const handleSelectPlace = (place: PlaceSearchResult) => {
    setPlace({
      kakaoPlaceId: place.kakaoPlaceId,
      placeName: place.placeName,
      categoryName: place.categoryName,
      addressName: place.addressName,
      roadAddressName: place.roadAddressName || null,
      longitude: place.longitude,
      latitude: place.latitude,
    });

    navigation.goBack();
  };

  const renderContent = () => {
    if (!trimmedQuery) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>어떤 장소를 남길까요?</Text>
          <Text style={styles.messageDescription}>
            카페, 공원, 동네 이름처럼 기억하고 싶은 장소를 검색해보세요.
          </Text>
        </View>
      );
    }

    if (isFetching) {
      return (
        <View style={styles.messageContainer}>
          <ActivityIndicator color={semanticColor.primary} />
          <Text style={styles.messageDescription}>장소를 찾고 있어요.</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>검색에 실패했어요</Text>
          <Text style={styles.messageDescription}>
            잠시 후 다시 검색해보세요.
          </Text>
        </View>
      );
    }

    if (places.length === 0) {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>검색 결과가 없어요</Text>
          <Text style={styles.messageDescription}>
            장소 이름이나 지역명을 조금 다르게 입력해보세요.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={places}
        keyExtractor={(place) => place.kakaoPlaceId}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <PlaceSearchResultItem place={item} onPress={handleSelectPlace} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          hitSlop={12}
          style={styles.backButton}
          onPress={handlePressBack}
        >
          <ArrowLeft
            color={semanticColor.textPrimary}
            size={24}
            strokeWidth={2.2}
          />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>장소 선택</Text>
          <Text style={styles.subtitle}>감정을 남길 장소를 찾아보세요</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <PlaceSearchBar
          query={query}
          onChangeQuery={setQuery}
          onClear={handleClearQuery}
        />
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 64,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  headerSpacer: {
    width: 44,
  },
  searchContainer: {
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  separator: {
    height: 10,
  },
  messageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  messageTitle: {
    color: semanticColor.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  messageDescription: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 10,
    textAlign: 'center',
  },
});
