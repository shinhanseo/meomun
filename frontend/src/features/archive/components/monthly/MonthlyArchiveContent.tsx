import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { useArchiveMonthly } from '../../hooks/useArchiveMonthly';
import type { ArchiveSort } from '../../types';

interface MonthlyArchiveContentProps {
  year: number;
  month: number;
  keyword: string;
  sort: ArchiveSort;
}

export function MonthlyArchiveContent({
  year,
  month,
  keyword,
  sort,
}: MonthlyArchiveContentProps) {
  const monthlyArchiveQuery = useArchiveMonthly(year, month, keyword, sort);

  if (monthlyArchiveQuery.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>월별 보관함을 불러오는 중이에요.</Text>
      </View>
    );
  }

  if (monthlyArchiveQuery.isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>월별 보관함</Text>
        <Text style={styles.description}>
          월별 보관함을 불러오지 못했어요.
        </Text>
      </View>
    );
  }

  const firstPage = monthlyArchiveQuery.data?.pages[0];
  const totalRecordCount =
    firstPage?.emotionCounts.reduce(
      (sum, emotionCount) => sum + emotionCount.recordCount,
      0,
    ) ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {year}년 {month}월
      </Text>

      <Text style={styles.description}>
        검색어: {keyword || '없음'} / 정렬: {sort}
      </Text>

      <Text style={styles.description}>
        기록 수: {totalRecordCount}개
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
