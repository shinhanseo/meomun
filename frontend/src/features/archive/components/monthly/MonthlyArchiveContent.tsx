import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { MainStackParamList } from '../../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../../shared/constants/color';
import { useArchiveMonthOptions } from '../../hooks/useArchiveMonthOptions';
import { useArchiveMonthly } from '../../hooks/useArchiveMonthly';
import type { ArchiveSort } from '../../types';
import { MonthlyArchiveRecordList } from './MonthlyArchiveRecordList';

interface MonthlyArchiveContentProps {
  year: number;
  month: number;
  keyword: string;
  sort: ArchiveSort;
  onChangeMonth: (year: number, month: number) => void;
}

type ArchiveNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function MonthlyArchiveContent({
  year,
  month,
  keyword,
  sort,
  onChangeMonth,
}: MonthlyArchiveContentProps) {
  const navigation = useNavigation<ArchiveNavigationProp>();
  const monthOptionsQuery = useArchiveMonthOptions();
  const monthlyArchiveQuery = useArchiveMonthly(year, month, keyword, sort);
  const monthOptions = monthOptionsQuery.data?.months ?? [];
  const records =
    monthlyArchiveQuery.data?.pages.flatMap((page) => page.records) ?? [];

  const handlePressRecord = (recordId: string) => {
    navigation.navigate('RecordDetail', { recordId });
  };

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
    <MonthlyArchiveRecordList
        year={year}
        month={month}
        emotionCounts={firstPage?.emotionCounts ?? []}
        monthOptions={monthOptions}
      records={records}
      hasNextPage={monthlyArchiveQuery.hasNextPage}
      isFetchingNextPage={monthlyArchiveQuery.isFetchingNextPage}
        onChangeMonth={onChangeMonth}
      onFetchNextPage={() => monthlyArchiveQuery.fetchNextPage()}
      onPressRecord={handlePressRecord}
      />
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
