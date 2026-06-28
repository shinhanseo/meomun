import { StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';
import {
  EMOTION_CODES,
  emotionMeta,
} from '../../../shared/constants/emotionMeta';
import type { DailyEmotionStats } from '../types/stats.types';

interface StatsEmotionCalendarSectionProps {
  year: number;
  month: number;
  calendar: DailyEmotionStats[];
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function StatsEmotionCalendarSection({
  year,
  month,
  calendar,
}: StatsEmotionCalendarSectionProps) {
  const cells = getCalendarCells(year, month);
  const emotionByDate = new Map(
    calendar.map((dayStats) => [dayStats.date.slice(0, 10), dayStats]),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{month}월 감정 달력</Text>
        <Text style={styles.subtitle}>날짜마다 남긴 감정을 색으로 모아봤어요.</Text>
      </View>

      <View style={styles.weekRow}>
        {WEEK_DAYS.map((weekDay, index) => (
          <Text
            key={weekDay}
            style={[
              styles.weekText,
              index === 0 && styles.sundayText,
              index === 6 && styles.saturdayText,
            ]}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const dateKey = formatDateKey(year, month, day);
          const dayStats = emotionByDate.get(dateKey);
          const emotions = dayStats?.emotions ?? [];
          const dominantEmotionColor = dayStats?.dominantEmotion
            ? emotionMeta[dayStats.dominantEmotion].color
            : null;

          return (
            <View key={dateKey} style={styles.dayCell}>
              <View
                style={[
                  styles.dayNumberBox,
                  dominantEmotionColor && {
                    backgroundColor: `${dominantEmotionColor}18`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    dominantEmotionColor && { color: dominantEmotionColor },
                  ]}
                >
                  {day}
                </Text>
              </View>

              <View style={styles.dotArea}>
                {emotions.map((item) => {
                  const meta = emotionMeta[item.emotion];

                  return (
                    <View
                      key={item.emotion}
                      style={[styles.dot, { backgroundColor: meta.color }]}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        {EMOTION_CODES.map((emotion) => {
          const meta = emotionMeta[emotion];

          return (
            <View key={emotion} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: meta.color },
                ]}
              />
              <Text style={styles.legendText}>{meta.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function getCalendarCells(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();
  const startDay = firstDay.getDay();

  const emptyCells = Array.from({ length: startDay }, () => null);
  const dateCells = Array.from({ length: lastDate }, (_, index) => index + 1);

  return [...emptyCells, ...dateCells];
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
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
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekText: {
    color: semanticColor.textSecondary,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  sundayText: {
    color: color.red[500],
  },
  saturdayText: {
    color: color.blue[500],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    alignItems: 'center',
    minHeight: 52,
    paddingTop: 3,
    width: `${100 / 7}%`,
  },
  dayNumberBox: {
    alignItems: 'center',
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  dayText: {
    color: semanticColor.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  dotArea: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'center',
    marginTop: 5,
    minHeight: 13,
    width: 30,
  },
  dot: {
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  legend: {
    borderTopColor: semanticColor.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginTop: 14,
    paddingTop: 14,
  },
  legendItem: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    width: '23.5%',
  },
  legendDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  legendText: {
    color: semanticColor.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },
});
