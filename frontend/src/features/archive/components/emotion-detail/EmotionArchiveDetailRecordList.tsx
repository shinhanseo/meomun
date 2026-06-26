import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { AllArchiveRecordCard } from '../all/AllArchiveRecordCard';
import type { ArchiveRecordListItem } from '../../types';

interface EmotionArchiveDetailRecordListProps {
  records: ArchiveRecordListItem[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  listHeaderComponent: ReactElement;
  onEndReached: () => void;
  onPressRecord: (recordId: string) => void;
  onRetry: () => void;
}

export function EmotionArchiveDetailRecordList({
  records,
  isLoading,
  isError,
  isFetchingNextPage,
  listHeaderComponent,
  onEndReached,
  onPressRecord,
  onRetry,
}: EmotionArchiveDetailRecordListProps) {
  return (
    <>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AllArchiveRecordCard record={item} onPress={onPressRecord} />
        )}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>기록이 없어요.</Text>
              <Text style={styles.emptyDescription}>
                검색어를 바꾸거나 다른 감정을 살펴보세요.
              </Text>
            </View>
          )
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
        keyboardShouldPersistTaps="handled"
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#8E6CE5" size="small" />
        </View>
      )}

      {isError && (
        <View style={styles.errorOverlay}>
          <Text style={styles.emptyTitle}>감정 기록을 불러오지 못했어요.</Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
            onPress={onRetry}
          >
            <Text style={styles.retryButtonText}>다시 불러오기</Text>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 34,
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
  errorOverlay: {
    alignItems: 'center',
    backgroundColor: semanticColor.background,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 22,
  },
  footerSpacer: {
    height: 20,
  },
  loadingOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(248, 245, 255, 0.72)',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  pressed: {
    opacity: 0.72,
  },
  retryButton: {
    backgroundColor: '#8E6CE5',
    borderRadius: 14,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
