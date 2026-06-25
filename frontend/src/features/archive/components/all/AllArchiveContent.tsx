import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { useArchiveAll } from '../../hooks/useArchiveAll';
import type { ArchiveSort } from '../../types/archive.types';
import { AllArchiveSummarySection } from './AllArchiveSummarySection';

interface AllArchiveContentProps {
  keyword: string;
  sort: ArchiveSort;
}

export function AllArchiveContent({ keyword, sort }: AllArchiveContentProps) {
  const archiveQuery = useArchiveAll(keyword, sort);
  const firstPage = archiveQuery.data?.pages[0];

  if (archiveQuery.isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator color="#8E6CE5" size="small" />
        <Text style={styles.stateText}>보관함을 불러오는 중이에요.</Text>
      </View>
    );
  }

  if (archiveQuery.isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>보관함을 불러오지 못했어요.</Text>
        <Text style={styles.stateText}>잠시 후 다시 시도해주세요.</Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => archiveQuery.refetch()}
        >
          <Text style={styles.retryButtonText}>다시 불러오기</Text>
        </Pressable>
      </View>
    );
  }

  if (!firstPage) {
    return null;
  }

  return (
    <View>
      <AllArchiveSummarySection stats={firstPage.stats} />
    </View>
  );
}

const styles = StyleSheet.create({
  errorTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
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
    marginTop: 10,
    textAlign: 'center',
  },
});
