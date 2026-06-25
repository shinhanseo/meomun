import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import type { ArchiveSort } from '../../types/archive.types';

interface EmotionArchiveContentProps {
  keyword: string;
  sort: ArchiveSort;
}

export function EmotionArchiveContent({
  keyword,
  sort,
}: EmotionArchiveContentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>감정별 보관함</Text>
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
