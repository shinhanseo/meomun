import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { color, semanticColor } from '../../../shared/constants/color';
import type { HourlyStatsItem } from '../types/stats.types';

interface StatsHourlyDistributionSectionProps {
  hourlyDistribution: HourlyStatsItem[];
  peakHour: HourlyStatsItem | null;
}

export function StatsHourlyDistributionSection({
  hourlyDistribution,
  peakHour,
}: StatsHourlyDistributionSectionProps) {
  const hourlyMap = new Map(
    hourlyDistribution.map((item) => [item.hour, item]),
  );

  const hours = Array.from({ length: 24 }, (_, hour) => {
    return hourlyMap.get(hour) ?? {
      hour,
      recordCount: 0,
      percentage: 0,
    };
  });

  const hasData = hours.some((item) => item.recordCount > 0);

  const maxRecordCount = Math.max(
    ...hours.map((item) => item.recordCount),
    1,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextArea}>
          <Text style={styles.title}>가장 자주 기록한 시간</Text>
          <Text style={styles.subtitle}>
            당신은 몇 시에 감정을 가장 많이 기록했을까요?
          </Text>
        </View>

        {peakHour ? (
          <View style={styles.peakBadge}>
            <Text style={styles.peakTime}>
              {formatHourLabel(peakHour.hour)}
            </Text>
            <Text style={styles.peakPercent}>
              기록 비율 {peakHour.percentage}%
            </Text>
          </View>
        ) : null}
      </View>

      {hasData ? (
        <>
          <View style={styles.chartArea}>
            {hours.map((item) => {
              const barHeight =
                item.recordCount > 0
                  ? Math.max((item.recordCount / maxRecordCount) * 96, 8)
                  : 3;

              const isPeak = peakHour?.hour === item.hour;

              return (
                <View key={item.hour} style={styles.barSlot}>
                  <LinearGradient
                    colors={
                      isPeak
                        ? ['#8E6CE5', '#D894EA']
                        : ['#DCCBFF', '#F0D8F0']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        opacity: item.recordCount > 0 ? 1 : 0.35,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          <View style={styles.axisRow}>
            <Text style={styles.axisText}>0시</Text>
            <Text style={styles.axisText}>6시</Text>
            <Text style={styles.axisText}>12시</Text>
            <Text style={styles.axisText}>18시</Text>
            <Text style={styles.axisText}>24시</Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            아직 시간대 통계를 만들 기록이 없어요.
          </Text>
        </View>
      )}
    </View>
  );
}

function formatHourLabel(hour: number) {
  if (hour === 0) {
    return '오전 12시';
  }

  if (hour < 12) {
    return `오전 ${hour}시`;
  }

  if (hour === 12) {
    return '오후 12시';
  }

  return `오후 ${hour - 12}시`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTextArea: {
    flex: 1,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  subtitle: {
    color: semanticColor.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    marginTop: 5,
  },
  peakBadge: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  peakTime: {
    color: color.purple[600],
    fontSize: 12,
    fontWeight: '900',
  },
  peakPercent: {
    color: semanticColor.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  chartArea: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 4,
    height: 112,
    paddingTop: 8,
  },
  barSlot: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 999,
    width: '78%',
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  axisText: {
    color: semanticColor.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    backgroundColor: '#F8F4FF',
    borderRadius: 16,
    paddingVertical: 26,
  },
  emptyText: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});