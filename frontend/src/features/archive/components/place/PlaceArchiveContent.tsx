import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, MapPin } from 'lucide-react-native';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainStackParamList } from '../../../../app/navigation/MainStackNavigator';
import { color, semanticColor } from '../../../../shared/constants/color';
import { emotionMeta } from '../../../../shared/constants/emotionMeta';
import { usePlaceArchive } from '../../hooks/usePlaceArchive';
import type { ArchiveSort, PlaceArchiveSummaryItem } from '../../types';
import { ArchiveSkeleton } from '../shared/ArchiveSkeleton';

interface PlaceArchiveContentProps {
  keyword: string;
  sort: ArchiveSort;
}

type ArchiveNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function PlaceArchiveContent({
  keyword,
  sort,
}: PlaceArchiveContentProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ArchiveNavigationProp>();
  const placeArchiveQuery = usePlaceArchive(keyword, sort);
  const places = placeArchiveQuery.data?.places ?? [];
  const totalRecordCount = places.reduce(
    (sum, place) => sum + place.recordCount,
    0,
  );

  const handlePressPlace = (placeId: string) => {
    navigation.navigate('PlaceArchiveDetail', { placeId });
  };

  if (placeArchiveQuery.isLoading) {
    return <ArchiveSkeleton variant="all" />;
  }

  if (placeArchiveQuery.isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>장소 기록을 불러오지 못했어요.</Text>
        <Text style={styles.stateDescription}>잠시 후 다시 시도해주세요.</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => placeArchiveQuery.refetch()}
        >
          <Text style={styles.retryButtonText}>다시 불러오기</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(item) => item.place.id}
      renderItem={({ item }) => (
        <PlaceArchiveCard place={item} onPress={handlePressPlace} />
      )}
      ListHeaderComponent={
        <View style={styles.summary}>
          <View style={styles.summaryIcon}>
            <MapPin color={color.purple[600]} size={22} strokeWidth={2.4} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryKicker}>장소별 보관함</Text>
            <Text style={styles.summaryTitle}>
              {places.length}곳에 {totalRecordCount}개의 기록이 머물러 있어요
            </Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>아직 장소 기록이 없어요.</Text>
          <Text style={styles.stateDescription}>
            감정을 남기면 장소별로 기록이 모일 거예요.
          </Text>
        </View>
      }
      ListFooterComponent={<View style={styles.footerSpacer} />}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 110 },
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

function PlaceArchiveCard({
  place,
  onPress,
}: {
  place: PlaceArchiveSummaryItem;
  onPress: (placeId: string) => void;
}) {
  const emotion = place.mostRecordedEmotion
    ? emotionMeta[place.mostRecordedEmotion]
    : null;
  const latestDate = formatPlaceArchiveDate(place.latestRecordedAt);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(place.place.id)}
    >
      {place.thumbnailImage ? (
        <Image
          source={{ uri: place.thumbnailImage.imageUrl }}
          style={styles.thumbnail}
        />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailFallback]}>
          <MapPin color={color.purple[500]} size={26} strokeWidth={2.4} />
        </View>
      )}

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.placeName} numberOfLines={1}>
            {place.place.placeName}
          </Text>
          <ChevronRight color={color.purple[300]} size={19} strokeWidth={2.4} />
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {place.place.roadAddressName ?? place.place.addressName}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.recordCount}>{place.recordCount}개 기록</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.latestDate}>{latestDate}</Text>
        </View>

        {emotion ? (
          <View style={[styles.emotionBadge, { backgroundColor: `${emotion.color}18` }]}>
            <Image source={emotion.icon} style={styles.emotionIcon} />
            <Text style={[styles.emotionText, { color: emotion.color }]}>
              {emotion.label}이 가장 많아요
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function formatPlaceArchiveDate(value: string) {
  const date = new Date(value);

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(date.getDate()).padStart(2, '0')} 최근 기록`;
}

const styles = StyleSheet.create({
  address: {
    color: semanticColor.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
  },
  card: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 12,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  contentContainer: {
    paddingTop: 12,
  },
  dot: {
    color: semanticColor.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  emotionBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emotionIcon: {
    height: 14,
    resizeMode: 'contain',
    width: 14,
  },
  emotionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  footerSpacer: {
    height: 20,
  },
  latestDate: {
    color: semanticColor.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  placeName: {
    color: semanticColor.textPrimary,
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.76,
  },
  recordCount: {
    color: color.purple[600],
    fontSize: 12,
    fontWeight: '900',
  },
  retryButton: {
    backgroundColor: color.purple[600],
    borderRadius: 14,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryButtonText: {
    color: color.white,
    fontSize: 14,
    fontWeight: '800',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  stateDescription: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  stateTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  summary: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 24,
    marginBottom: 10,
    padding: 18,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    borderRadius: 18,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  summaryKicker: {
    color: color.purple[500],
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
  },
  summaryTitle: {
    color: semanticColor.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 25,
  },
  thumbnail: {
    borderRadius: 16,
    height: 82,
    width: 82,
  },
  thumbnailFallback: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    justifyContent: 'center',
  },
});
