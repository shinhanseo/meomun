import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { useArchiveMonthOptions } from '../../hooks/useArchiveMonthOptions';
import { useArchiveMonthly } from '../../hooks/useArchiveMonthly';
import type { ArchiveSort } from '../../types';
import { MonthlyArchiveSummarySection } from './MonthlyArchiveSummarySection';

interface MonthlyArchiveContentProps {
  year: number;
  month: number;
  keyword: string;
  sort: ArchiveSort;
  onChangeMonth: (year: number, month: number) => void;
}

export function MonthlyArchiveContent({
  year,
  month,
  keyword,
  sort,
  onChangeMonth,
}: MonthlyArchiveContentProps) {
  const monthOptionsQuery = useArchiveMonthOptions();
  const monthlyArchiveQuery = useArchiveMonthly(year, month, keyword, sort);
  const monthOptions = monthOptionsQuery.data?.months ?? [];

  useEffect(() => {
    if (monthOptions.length === 0) {
      return;
    }

    const selectedMonthExists = monthOptions.some(
      (monthOption) =>
        monthOption.year === year && monthOption.month === month,
    );

    if (selectedMonthExists) {
      return;
    }

    const latestMonthOption = monthOptions[0];

    onChangeMonth(latestMonthOption.year, latestMonthOption.month);
  }, [month, monthOptions, onChangeMonth, year]);

  if (monthOptionsQuery.isLoading || monthlyArchiveQuery.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>월별 보관함을 불러오는 중이에요.</Text>
      </View>
    );
  }

  if (monthOptionsQuery.isError || monthlyArchiveQuery.isError) {
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
  return (
    <View>
      <MonthlyArchiveSummarySection
        year={year}
        month={month}
        emotionCounts={firstPage?.emotionCounts ?? []}
        monthOptions={monthOptions}
        onChangeMonth={onChangeMonth}
      />
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
