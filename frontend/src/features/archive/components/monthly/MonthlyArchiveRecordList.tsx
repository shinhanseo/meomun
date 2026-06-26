import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import type {
  ArchiveMonthOption,
  MonthlyArchiveEmotionCount,
  MonthlyArchiveRecordItem,
} from '../../types';
import { AllArchiveRecordCard } from '../all/AllArchiveRecordCard';
import { MonthlyArchiveSummarySection } from './MonthlyArchiveSummarySection';

interface MonthlyArchiveRecordListProps {
  year: number;
  month: number;
  emotionCounts: MonthlyArchiveEmotionCount[];
  monthOptions: ArchiveMonthOption[];
  records: MonthlyArchiveRecordItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onChangeMonth: (year: number, month: number) => void;
  onFetchNextPage: () => void;
  onPressRecord: (recordId: string) => void;
}

export function MonthlyArchiveRecordList({
  year,
  month,
  emotionCounts,
  monthOptions,
  records,
  hasNextPage,
  isFetchingNextPage,
  onChangeMonth,
  onFetchNextPage,
  onPressRecord,
}: MonthlyArchiveRecordListProps) {
  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    onFetchNextPage();
  };

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AllArchiveRecordCard record={item} onPress={onPressRecord} />
      )}
      ListHeaderComponent={
        <>
          <MonthlyArchiveSummarySection
            year={year}
            month={month}
            emotionCounts={emotionCounts}
            monthOptions={monthOptions}
            onChangeMonth={onChangeMonth}
          />
          <Text style={styles.listTitle}>{month}월의 기록</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>이 달에는 기록이 없어요.</Text>
          <Text style={styles.emptyDescription}>
            다른 월을 선택해서 남겨둔 감정을 살펴보세요.
          </Text>
        </View>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footer}>
            <ActivityIndicator color="#8E6CE5" size="small" />
          </View>
        ) : (
          <View style={styles.footerSpacer} />
        )
      }
      contentContainerStyle={styles.contentContainer}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 34,
  },
  emptyDescription: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 22,
  },
  footerSpacer: {
    height: 20,
  },
  listTitle: {
    color: '#5E4B9A',
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 24,
    marginTop: 22,
  },
});
