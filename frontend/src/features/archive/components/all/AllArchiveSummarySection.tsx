import type { ReactNode } from 'react';
import { CalendarDays, MapPin, Moon } from 'lucide-react-native';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { emotionMeta } from '../../../../shared/constants/emotionMeta';
import type { ArchiveOverviewStats } from '../../types';

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
    <LinearGradient
      colors={['#7D68D8', '#B99AF4', '#F5C9DF']}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.glowLarge} />
      <View style={styles.glowSmall} />
      <View style={styles.starOne} />
      <View style={styles.starTwo} />

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
    </LinearGradient>
  );
}

function SummaryItem({ icon, label, value }: SummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryHeader}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={styles.summaryLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>

      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        numberOfLines={1}
        style={styles.summaryValue}
      >
        {value}
      </Text>
    </View>
  );
}

function formatSummaryDate(date: string | null) {
  if (!date) {
    return '-';
  }

  const parsedDate = new Date(date);
  const year = String(parsedDate.getFullYear()).slice(2);
  const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 24,
    marginTop: 30,
    minHeight: 188,
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  glowLarge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    height: 170,
    position: 'absolute',
    right: -60,
    top: -70,
    width: 170,
  },
  glowSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    bottom: -46,
    height: 120,
    left: -42,
    position: 'absolute',
    width: 120,
  },
  starOne: {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: 999,
    height: 5,
    position: 'absolute',
    right: 90,
    top: 26,
    width: 5,
  },
  starTwo: {
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    borderRadius: 999,
    height: 4,
    position: 'absolute',
    right: 118,
    top: 50,
    width: 4,
  },
  totalArea: {
    flex: 0.46,
    justifyContent: 'center',
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  totalCount: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  totalUnit: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 17,
    fontWeight: '800',
  },
  summaryGrid: {
    flex: 1.2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  summaryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderColor: 'rgba(255, 255, 255, 0.34)',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 70,
    paddingHorizontal: 9,
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
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
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
    color: 'rgba(255, 255, 255, 0.74)',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 12,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
    ...Platform.select({
      ios: {
        letterSpacing: -0.1,
      },
    }),
  },
});
