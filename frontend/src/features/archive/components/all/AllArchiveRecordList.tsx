import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import type {
  ArchiveOverviewStats,
  ArchiveRecordListItem,
} from '../../types';
import { AllArchiveRecordCard } from './AllArchiveRecordCard';
import { AllArchiveSummarySection } from './AllArchiveSummarySection';

interface AllArchiveRecordListProps {
  stats: ArchiveOverviewStats;
  records: ArchiveRecordListItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onPressRecord: (recordId: string) => void;
}

export function AllArchiveRecordList({
  stats,
  records,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onPressRecord,
}: AllArchiveRecordListProps) {
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
          <AllArchiveSummarySection stats={stats} />
          <Text style={styles.listTitle}>모든 기록</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>아직 기록이 없어요.</Text>
          <Text style={styles.emptyDescription}>
            감정을 남기면 이곳에 차곡차곡 모일 거예요.
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
