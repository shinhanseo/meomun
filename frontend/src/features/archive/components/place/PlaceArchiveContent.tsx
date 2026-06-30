import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    return <PlaceArchiveSkeleton />;
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
        <>
          <LinearGradient
            colors={['#7453C1', '#A68AE1', '#F2A4C9']}
            locations={[0, 0.58, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryGlowLarge} />
            <View style={styles.summaryGlowSmall} />

            <View style={styles.summaryCopy}>
              <Text style={styles.summaryKicker}>장소별 보관함</Text>
              <Text style={styles.summaryTitle} numberOfLines={1}>
                {places.length}곳
              </Text>
              <Text style={styles.summaryDescription}>
                남겨둔 {totalRecordCount}개의 기록을{'\n'}장소별로 모아봤어요.
              </Text>
            </View>

            <View style={styles.mapPreview}>
              <View style={[styles.routeHalo, styles.routeHaloTop]} />
              <View style={[styles.routeHalo, styles.routeHaloMiddle]} />
              <View style={[styles.routeHalo, styles.routeHaloBottom]} />
              <View style={[styles.routeTrailDot, styles.routeTrailDotOne]} />
              <View style={[styles.routeTrailDot, styles.routeTrailDotTwo]} />
              <View style={[styles.routeTrailDot, styles.routeTrailDotThree]} />
              <View style={[styles.routeTrailDot, styles.routeTrailDotFour]} />
              <View style={[styles.routeLine, styles.routeLineTop]} />
              <View style={[styles.routeLine, styles.routeLineBottom]} />
              <View style={[styles.routePin, styles.routePinTop]}>
                <MapPin color="#FFFFFF" size={18} strokeWidth={2.6} />
              </View>
              <View style={[styles.routePin, styles.routePinMiddle]}>
                <MapPin color="#FFFFFF" size={24} strokeWidth={2.6} />
              </View>
              <View style={[styles.routePin, styles.routePinBottom]}>
                <MapPin color="#FFFFFF" size={16} strokeWidth={2.6} />
              </View>
            </View>
          </LinearGradient>

          <Text style={styles.listTitle}>장소 모아보기</Text>
        </>
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
  const accentColor = emotion?.color ?? color.purple[500];

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(place.place.id)}
    >
      <View style={styles.thumbnailFrame}>
        {place.thumbnailImage ? (
          <Image
            source={{ uri: place.thumbnailImage.imageUrl }}
            style={styles.thumbnail}
          />
        ) : (
          <View
            style={[
              styles.thumbnail,
              styles.thumbnailFallback,
              { backgroundColor: `${accentColor}18` },
            ]}
          >
            <MapPin color={accentColor} size={28} strokeWidth={2.4} />
          </View>
        )}

        <View style={[styles.countBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.countBadgeText}>{place.recordCount}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.placeTitleArea}>
            <Text style={styles.placeName} numberOfLines={1}>
              {place.place.placeName}
            </Text>
            <Text style={styles.address} numberOfLines={1}>
              {place.place.roadAddressName ?? place.place.addressName}
            </Text>
          </View>

          <View style={styles.arrowCircle}>
            <ChevronRight
              color={color.purple[500]}
              size={18}
              strokeWidth={2.6}
            />
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.metaPill}>
            <Text style={styles.recordCount}>{place.recordCount}개 기록</Text>
          </View>

          <Text style={styles.latestDate}>{latestDate}</Text>
        </View>

        {emotion ? (
          <View
            style={[
              styles.emotionBadge,
              { backgroundColor: `${emotion.color}18` },
            ]}
          >
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

function PlaceArchiveSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonSummary}>
        <View style={styles.skeletonSummaryIcon} />
        <View style={styles.skeletonSummaryCopy}>
          <View style={styles.skeletonLineSmall} />
          <View style={styles.skeletonLineLarge} />
        </View>
      </View>

      {[0, 1, 2, 3].map((item) => (
        <View key={item} style={styles.skeletonCard}>
          <View style={styles.skeletonThumbnail} />
          <View style={styles.skeletonCardCopy}>
            <View style={styles.skeletonLineTitle} />
            <View style={styles.skeletonLineMedium} />
            <View style={styles.skeletonLineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    color: semanticColor.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
  arrowCircle: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  card: {
    backgroundColor: color.white,
    borderColor: 'rgba(142, 108, 229, 0.08)',
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 12,
    overflow: 'hidden',
    padding: 14,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  cardContent: {
    marginTop: 13,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  contentContainer: {
    paddingTop: 0,
  },
  countBadge: {
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    bottom: -8,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: -8,
    width: 36,
  },
  countBadgeText: {
    color: color.white,
    fontSize: 14,
    fontWeight: '900',
  },
  emotionBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 9,
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
  listTitle: {
    color: '#5E4B9A',
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 24,
    marginTop: 22,
  },
  metaPill: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  placeName: {
    color: semanticColor.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  placeTitleArea: {
    flex: 1,
    minWidth: 0,
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
  mapPreview: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 122,
    justifyContent: 'center',
    position: 'relative',
    width: 104,
  },
  routeHalo: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 999,
    borderWidth: 1,
    position: 'absolute',
  },
  routeHaloBottom: {
    bottom: 12,
    height: 52,
    left: 2,
    width: 52,
  },
  routeHaloMiddle: {
    height: 72,
    right: -4,
    top: 31,
    width: 72,
  },
  routeHaloTop: {
    height: 54,
    left: 13,
    top: 1,
    width: 54,
  },
  routeLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 999,
    height: 38,
    position: 'absolute',
    width: 2,
  },
  routeLineBottom: {
    bottom: 31,
    right: 55,
    transform: [{ rotate: '46deg' }],
  },
  routeLineTop: {
    right: 44,
    top: 34,
    transform: [{ rotate: '-44deg' }],
  },
  routePin: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: '#6E3DB4',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  routePinBottom: {
    bottom: 20,
    height: 34,
    left: 10,
    width: 34,
  },
  routePinMiddle: {
    height: 50,
    right: 8,
    top: 40,
    width: 50,
  },
  routePinTop: {
    height: 38,
    left: 21,
    top: 9,
    width: 38,
  },
  routeTrailDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 999,
    height: 4,
    position: 'absolute',
    width: 4,
  },
  routeTrailDotFour: {
    bottom: 47,
    right: 50,
  },
  routeTrailDotOne: {
    right: 49,
    top: 53,
  },
  routeTrailDotThree: {
    bottom: 54,
    right: 42,
  },
  routeTrailDotTwo: {
    right: 43,
    top: 62,
  },
  summaryCard: {
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 20,
    minHeight: 164,
    overflow: 'hidden',
    padding: 22,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  summaryCopy: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: 16,
  },
  summaryDescription: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
  },
  summaryGlowLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    height: 170,
    position: 'absolute',
    right: -60,
    top: -70,
    width: 170,
  },
  summaryGlowSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    bottom: -46,
    height: 120,
    left: -42,
    position: 'absolute',
    width: 120,
  },
  summaryKicker: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryTitle: {
    color: color.white,
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 46,
    marginTop: 6,
  },
  skeletonCard: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 12,
  },
  skeletonCardCopy: {
    flex: 1,
    gap: 10,
  },
  skeletonContainer: {
    paddingTop: 12,
  },
  skeletonLineLarge: {
    backgroundColor: color.purple[100],
    borderRadius: 999,
    height: 18,
    width: '88%',
  },
  skeletonLineMedium: {
    backgroundColor: color.gray[100],
    borderRadius: 999,
    height: 12,
    width: '78%',
  },
  skeletonLineShort: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    height: 18,
    width: 96,
  },
  skeletonLineSmall: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    height: 12,
    width: 84,
  },
  skeletonLineTitle: {
    backgroundColor: color.purple[100],
    borderRadius: 999,
    height: 16,
    width: '62%',
  },
  skeletonSummary: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 24,
    marginBottom: 10,
    padding: 18,
  },
  skeletonSummaryCopy: {
    flex: 1,
    gap: 10,
  },
  skeletonSummaryIcon: {
    backgroundColor: color.purple[50],
    borderRadius: 18,
    height: 48,
    width: 48,
  },
  skeletonThumbnail: {
    backgroundColor: color.purple[50],
    borderRadius: 16,
    height: 82,
    width: 82,
  },
  thumbnail: {
    borderRadius: 18,
    height: 132,
    width: '100%',
  },
  thumbnailFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailFrame: {
    position: 'relative',
  },
});
