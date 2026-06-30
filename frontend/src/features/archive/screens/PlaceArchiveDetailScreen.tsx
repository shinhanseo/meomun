import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainStackParamList } from '../../../app/navigation/MainStackNavigator';
import { color, semanticColor } from '../../../shared/constants/color';
import { emotionMeta } from '../../../shared/constants/emotionMeta';
import { usePlaceArchiveDetail } from '../hooks/usePlaceArchiveDetail';
import type { ArchiveRecordListItem } from '../types';

type Props = NativeStackScreenProps<MainStackParamList, 'PlaceArchiveDetail'>;

export function PlaceArchiveDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const placeArchiveQuery = usePlaceArchiveDetail(route.params.placeId);
  const firstPage = placeArchiveQuery.data?.pages[0];
  const records =
    placeArchiveQuery.data?.pages.flatMap((page) => page.records) ?? [];
  const place = firstPage?.place;

  const handleEndReached = () => {
    if (
      !placeArchiveQuery.hasNextPage ||
      placeArchiveQuery.isFetchingNextPage
    ) {
      return;
    }

    placeArchiveQuery.fetchNextPage();
  };

  const handlePressRecord = (recordId: string) => {
    navigation.navigate('RecordDetail', { recordId });
  };

  if (placeArchiveQuery.isLoading) {
    return (
      <View style={styles.container}>
        <Header onPressBack={navigation.goBack} />
        <PlaceTimelineSkeleton />
      </View>
    );
  }

  if (placeArchiveQuery.isError || !firstPage || !place) {
    return (
      <View style={styles.container}>
        <Header onPressBack={navigation.goBack} />
        <View style={styles.stateContainer}>
          <Text style={styles.errorTitle}>장소 기록을 불러오지 못했어요.</Text>
          <Text style={styles.stateText}>잠시 후 다시 시도해주세요.</Text>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TimelineRecordCard
            record={item}
            isLast={index === records.length - 1}
            onPress={handlePressRecord}
          />
        )}
        ListHeaderComponent={
          <>
            <Header onPressBack={navigation.goBack} />
            <View style={styles.placeSummary}>
              <View style={styles.placeIconFrame}>
                <MapPin color={color.purple[600]} size={22} strokeWidth={2.4} />
              </View>
              <View style={styles.placeCopy}>
                <Text style={styles.kicker}>장소 타임라인</Text>
                <Text style={styles.placeName} numberOfLines={2}>
                  {place.placeName}
                </Text>
                <Text style={styles.placeAddress} numberOfLines={1}>
                  {place.roadAddressName ?? place.addressName}
                </Text>
              </View>
            </View>

            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>처음 머문 순간부터</Text>
              <Text style={styles.timelineCount}>
                {firstPage.recordCount}개
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.stateContainer}>
            <Text style={styles.errorTitle}>아직 기록이 없어요.</Text>
            <Text style={styles.stateText}>
              이 장소에 남긴 기록이 이곳에 모일 거예요.
            </Text>
          </View>
        }
        ListFooterComponent={
          placeArchiveQuery.isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={color.purple[600]} size="small" />
            </View>
          ) : (
            <View style={styles.footerSpacer} />
          )
        }
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 32 },
        ]}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function Header({ onPressBack }: { onPressBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="뒤로 가기"
        onPress={onPressBack}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.pressed,
        ]}
      >
        <ChevronLeft color={color.purple[800]} size={24} strokeWidth={2.5} />
      </Pressable>
      <Text style={styles.headerTitle}>장소 기록</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function TimelineRecordCard({
  record,
  isLast,
  onPress,
}: {
  record: ArchiveRecordListItem;
  isLast: boolean;
  onPress: (recordId: string) => void;
}) {
  const emotion = emotionMeta[record.emotion];
  const formattedDate = formatTimelineDate(record.recordedAt);

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineRail}>
        <View style={[styles.timelineDot, { backgroundColor: emotion.color }]} />
        {!isLast ? <View style={styles.timelineLine} /> : null}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.recordCard,
          pressed && styles.pressed,
        ]}
        onPress={() => onPress(record.id)}
      >
        <View style={styles.recordHeader}>
          <Text style={[styles.recordDate, { color: emotion.color }]}>
            {formattedDate}
          </Text>
          <View style={[styles.recordEmotionBadge, { backgroundColor: `${emotion.color}18` }]}>
            <Image source={emotion.icon} style={styles.recordEmotionIcon} />
            <Text style={[styles.recordEmotionText, { color: emotion.color }]}>
              {emotion.label}
            </Text>
          </View>
        </View>

        <Text style={styles.recordTitle} numberOfLines={1}>
          {record.title}
        </Text>

        <Text style={styles.recordContent} numberOfLines={2}>
          {record.content || '남겨진 기록 내용이 없어요.'}
        </Text>
      </Pressable>
    </View>
  );
}

function formatTimelineDate(value: string) {
  const date = new Date(value);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const period = date.getHours() < 12 ? '오전' : '오후';
  const hour = date.getHours() % 12 || 12;
  const minute = `${date.getMinutes()}`.padStart(2, '0');

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(date.getDate()).padStart(2, '0')} ${weekdays[date.getDay()]} ${period} ${hour}:${minute}`;
}

function PlaceTimelineSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonSummary}>
        <View style={styles.skeletonSummaryIcon} />
        <View style={styles.skeletonSummaryCopy}>
          <View style={styles.skeletonKicker} />
          <View style={styles.skeletonPlaceName} />
          <View style={styles.skeletonAddress} />
        </View>
      </View>

      <View style={styles.skeletonTimelineHeader}>
        <View style={styles.skeletonSectionTitle} />
        <View style={styles.skeletonCountChip} />
      </View>

      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.skeletonTimelineItem}>
          <View style={styles.skeletonRail}>
            <View style={styles.skeletonDot} />
            {item < 2 ? <View style={styles.skeletonLine} /> : null}
          </View>
          <View style={styles.skeletonRecordCard}>
            <View style={styles.skeletonRecordMeta} />
            <View style={styles.skeletonRecordTitle} />
            <View style={styles.skeletonRecordContent} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: 40,
  },
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  errorTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 22,
  },
  footerSpacer: {
    height: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 62,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: color.purple[900],
    fontSize: 17,
    fontWeight: '900',
  },
  kicker: {
    color: color.purple[500],
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 5,
  },
  placeAddress: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 7,
  },
  placeCopy: {
    flex: 1,
    minWidth: 0,
  },
  placeIconFrame: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    borderRadius: 18,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  placeName: {
    color: semanticColor.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 31,
  },
  placeSummary: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 15,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 18,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  pressed: {
    opacity: 0.72,
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
  recordCard: {
    backgroundColor: color.white,
    borderRadius: 18,
    flex: 1,
    padding: 16,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  recordContent: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 8,
  },
  recordDate: {
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
  },
  recordEmotionBadge: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recordEmotionIcon: {
    height: 14,
    resizeMode: 'contain',
    width: 14,
  },
  recordEmotionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  recordHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  recordTitle: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 10,
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  stateText: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  skeletonAddress: {
    backgroundColor: color.gray[100],
    borderRadius: 999,
    height: 12,
    width: '78%',
  },
  skeletonContainer: {
    paddingTop: 24,
  },
  skeletonCountChip: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    height: 24,
    width: 44,
  },
  skeletonDot: {
    backgroundColor: color.purple[100],
    borderColor: color.white,
    borderRadius: 999,
    borderWidth: 3,
    height: 16,
    width: 16,
  },
  skeletonKicker: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    height: 12,
    width: 92,
  },
  skeletonLine: {
    backgroundColor: color.purple[100],
    flex: 1,
    marginTop: 5,
    width: 2,
  },
  skeletonPlaceName: {
    backgroundColor: color.purple[100],
    borderRadius: 999,
    height: 22,
    width: '70%',
  },
  skeletonRail: {
    alignItems: 'center',
    paddingTop: 19,
    width: 18,
  },
  skeletonRecordCard: {
    backgroundColor: color.white,
    borderRadius: 18,
    flex: 1,
    gap: 12,
    padding: 16,
  },
  skeletonRecordContent: {
    backgroundColor: color.gray[100],
    borderRadius: 999,
    height: 13,
    width: '88%',
  },
  skeletonRecordMeta: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    height: 14,
    width: '72%',
  },
  skeletonRecordTitle: {
    backgroundColor: color.purple[100],
    borderRadius: 999,
    height: 17,
    width: '58%',
  },
  skeletonSectionTitle: {
    backgroundColor: color.purple[100],
    borderRadius: 999,
    height: 17,
    width: 116,
  },
  skeletonSummary: {
    alignItems: 'center',
    backgroundColor: color.white,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 15,
    marginHorizontal: 20,
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
  skeletonTimelineHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 24,
  },
  skeletonTimelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 24,
    marginTop: 12,
  },
  timelineCount: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    color: color.purple[600],
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timelineHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 24,
  },
  timelineTitle: {
    color: color.purple[800],
    fontSize: 16,
    fontWeight: '900',
  },
  timelineDot: {
    borderColor: color.white,
    borderRadius: 999,
    borderWidth: 3,
    height: 16,
    width: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 24,
    marginTop: 12,
  },
  timelineLine: {
    backgroundColor: color.purple[100],
    flex: 1,
    marginTop: 5,
    width: 2,
  },
  timelineRail: {
    alignItems: 'center',
    paddingTop: 19,
    width: 18,
  },
});
