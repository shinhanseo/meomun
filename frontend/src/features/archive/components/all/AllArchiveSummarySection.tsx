import type { ReactNode } from 'react';
import { CalendarDays, MapPin, Moon } from 'lucide-react-native';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { emotionMeta } from '../../../../shared/constants/emotionMeta';
import type { ArchiveOverviewStats } from '../../types/archive.types';

interface AllArchiveSummarySectionProps {
  stats: ArchiveOverviewStats;
}

interface SummaryItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function AllArchiveSummarySection({
  stats,
}: AllArchiveSummarySectionProps) {
  const mostRecordedEmotionMeta = stats.mostRecordedEmotion
    ? emotionMeta[stats.mostRecordedEmotion]
    : null;
  const mostRecordedEmotionLabel = mostRecordedEmotionMeta
    ? mostRecordedEmotionMeta.label
    : '-';

  return (
    <View style={styles.container}>
      <View style={styles.totalArea}>
        <Text style={styles.totalLabel}>총 기록</Text>

        <Text style={styles.totalCount}>
          {stats.totalRecordCount}
          <Text style={styles.totalUnit}>개</Text>
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <SummaryItem
          icon={<MapPin color="#8E6CE5" size={17} strokeWidth={2.4} />}
          label="기록한 장소"
          value={`${stats.totalPlaceCount}곳`}
        />

        <SummaryItem
          icon={
            mostRecordedEmotionMeta ? (
              <Image
                source={mostRecordedEmotionMeta.icon}
                style={styles.emotionIcon}
              />
            ) : null
          }
          label="가장 많았던 감정"
          value={mostRecordedEmotionLabel}
        />

        <SummaryItem
          icon={<CalendarDays color="#8E6CE5" size={17} strokeWidth={2.4} />}
          label="첫 기록"
          value={formatSummaryDate(stats.firstRecordedAt)}
        />

        <SummaryItem
          icon={<Moon color="#8E6CE5" size={17} strokeWidth={2.4} />}
          label="최근 기록"
          value={formatSummaryDate(stats.latestRecordedAt)}
        />
      </View>
    </View>
  );
}

function SummaryItem({ icon, label, value }: SummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryHeader}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>

      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function formatSummaryDate(date: string | null) {
  if (!date) {
    return '-';
  }

  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D8C8FF',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 24,
    marginTop: 30,
    minHeight: 166,
    overflow: 'hidden',
    padding: 18,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  totalArea: {
    flex: 0.35,
    justifyContent: 'center',
  },
  totalLabel: {
    color: '#5E4B9A',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  totalCount: {
    color: '#4A347F',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
  },
  totalUnit: {
    color: '#5E4B9A',
    fontSize: 18,
    fontWeight: '800',
  },
  totalDescription: {
    color: '#6E5C9D',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 10,
  },
  summaryGrid: {
    flex: 1.35,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  summaryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
    borderColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 68,
    paddingHorizontal: 10,
    paddingVertical: 9,
    width: '48%',
  },
  summaryHeader: {
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 8,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  emotionIcon: {
    height: 18,
    width: 18,
  },
  summaryLabel: {
    color: '#6E5C9D',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
  },
  summaryValue: {
    color: semanticColor.textPrimary,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
    ...Platform.select({
      ios: {
        letterSpacing: -0.1,
      },
    }),
  },
});
