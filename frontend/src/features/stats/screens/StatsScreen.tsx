import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { semanticColor } from '../../../shared/constants/color';
import { useArchiveMonthOptions } from '../../archive/hooks/useArchiveMonthOptions';
import { useStats } from '../hooks/useStats';

import { StatsEmotionCalendarSection } from '../components/StatsEmotionCalendarSection';
import { StatsEmotionDonutSection } from '../components/StatsEmotionDonutSection';
import { StatsHeader } from '../components/StatsHeader';
import { StatsLoadingState } from '../components/StatsLoadingState';
import { StatsTopEmotionCard } from '../components/StatsTopEmotion';
import { StatsHourlyDistributionSection } from '../components/StatsHourlyDistributionSection';

export function StatsScreen() {
  const insets = useSafeAreaInsets();

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const yearMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  const monthOptionsQuery = useArchiveMonthOptions();
  const statsQuery = useStats(yearMonth);

  const monthOptions = monthOptionsQuery.data?.months ?? [];

  const handleChangeMonth = useCallback((year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }, []);

  let content = null;

  if (monthOptionsQuery.isLoading || statsQuery.isLoading) {
    content = <StatsLoadingState />;
  } else if (statsQuery.data) {
    content = (
      <>
        <StatsTopEmotionCard
          topEmotion={statsQuery.data.topEmotion}
          totalRecordCount={statsQuery.data.totalRecordCount}
        />

        <StatsEmotionDonutSection
          totalRecordCount={statsQuery.data.totalRecordCount}
          emotionDistribution={statsQuery.data.emotionDistribution}
        />

        <StatsEmotionCalendarSection
          year={selectedYear}
          month={selectedMonth}
          calendar={statsQuery.data.calendar}
        />

        <StatsHourlyDistributionSection
          hourlyDistribution={statsQuery.data.hourlyDistribution}
          peakHour={statsQuery.data.peakHour}
        />
      </>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <StatsHeader
        year={selectedYear}
        month={selectedMonth}
        monthOptions={monthOptions}
        onChangeMonth={handleChangeMonth}
      />

      <View style={styles.content}>{content}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
  },
  content: {
    paddingBottom: 24,
  },
});