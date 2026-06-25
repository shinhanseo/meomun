import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import type { ArchiveSort } from '../../types/archive.types';

interface MonthlyArchiveContentProps {
  keyword: string;
  sort: ArchiveSort;
}

export function MonthlyArchiveContent({
  keyword,
  sort,
}: MonthlyArchiveContentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>월별 보관함</Text>
      <Text style={styles.description}>
        검색어: {keyword || '없음'} / 정렬: {sort}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 80,
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
});
