import { Image, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { semanticColor } from '../../../shared/constants/color';
import { emotionMeta } from '../../../shared/constants/emotionMeta';
import type { EmotionStatsItem } from '../types/stats.types';

interface StatsEmotionDonutSectionProps {
  totalRecordCount: number;
  emotionDistribution: EmotionStatsItem[];
}

export function StatsEmotionDonutSection({
  totalRecordCount,
  emotionDistribution,
}: StatsEmotionDonutSectionProps) {
  const chartData = emotionDistribution.map((item) => {
    const meta = emotionMeta[item.emotion];

    return {
      value: item.recordCount,
      color: meta.color,
    };
  });

  const hasData = totalRecordCount > 0 && chartData.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>감정 비율</Text>
        <Text style={styles.subtitle}>이번 달 감정이 어떻게 쌓였는지 볼 수 있어요.</Text>
      </View>

      {hasData ? (
        <View style={styles.content}>
          <View style={styles.chartWrapper}>
            <PieChart
              data={chartData}
              donut
              radius={72}
              innerRadius={48}
              innerCircleColor="#FFFFFF"
              strokeWidth={3}
              strokeColor="#FFFFFF"
              showText={false}
              focusOnPress={false}
            />

            <View style={styles.centerLabel}>
              <Text style={styles.centerSmall}>기록한 감정</Text>
              <Text style={styles.centerCount}>{totalRecordCount}개</Text>
            </View>
          </View>

          <View style={styles.legendList}>
            {emotionDistribution.map((item) => {
              const meta = emotionMeta[item.emotion];

              return (
                <View key={item.emotion} style={styles.legendItem}>
                  <View style={[styles.iconCircle, { backgroundColor: `${meta.color}22` }]}>
                    <Image source={meta.icon} style={styles.emotionImage} />
                  </View>

                  <View style={styles.legendTextArea}>
                    <Text style={styles.legendLabel}>{meta.label}</Text>
                    <Text style={styles.legendCount}>{item.recordCount}개</Text>
                  </View>

                  <Text style={[styles.percentage, { color: meta.color }]}>
                    {item.percentage}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>아직 이번 달 감정 기록이 없어요.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 18,
  },
  header: {
    marginBottom: 18,
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
    marginTop: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  chartWrapper: {
    width: 154,
    height: 154,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerSmall: {
    color: semanticColor.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  centerCount: {
    color: semanticColor.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  legendList: {
    flex: 1,
    gap: 10,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  emotionImage: {
    height: 20,
    resizeMode: 'contain',
    width: 20,
  },
  legendTextArea: {
    flex: 1,
    marginLeft: 8,
  },
  legendLabel: {
    color: semanticColor.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  legendCount: {
    color: semanticColor.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '900',
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