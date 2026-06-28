import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { semanticColor } from '../../../shared/constants/color';
import { emotionMeta } from '../../../shared/constants/emotionMeta';
import type { EmotionStatsItem } from '../types/stats.types';

interface StatsTopEmotionCardProps {
  topEmotion: EmotionStatsItem | null;
  totalRecordCount: number;
}

export function StatsTopEmotionCard({
  topEmotion,
  totalRecordCount,
}: StatsTopEmotionCardProps) {
  const topEmotionMeta = topEmotion
    ? emotionMeta[topEmotion.emotion]
    : null;

  return (
    <LinearGradient
      colors={['#8E6CE5', '#C7A7F5', '#F3D5E8']}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.textArea}>
        <Text style={styles.eyebrow}>이번 달 가장 많이 느낀 감정</Text>

        <Text style={styles.emotionName}>
          {topEmotionMeta?.label ?? '아직 없어요'}
        </Text>

        <Text style={styles.description}>
          {topEmotion
            ? `전체 감정 중 ${topEmotion.percentage}%`
            : '기록을 남기면 감정 통계가 채워져요.'}
        </Text>

        <Text style={styles.countText}>총 기록 {totalRecordCount}개</Text>
      </View>

      <View style={styles.iconCircle}>
        {topEmotionMeta ? (
          <Image source={topEmotionMeta.icon} style={styles.emotionIcon} />
        ) : (
          <Text style={styles.emptyIcon}>?</Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    marginHorizontal: 24,
    marginTop: 22,
    minHeight: 150,
    overflow: 'hidden',
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  textArea: {
    flex: 1,
    paddingRight: 18,
  },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.88)',
    fontSize: 13,
    fontWeight: '800',
  },
  emotionName: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 12,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  countText: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 12,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 999,
    borderWidth: 1,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  emotionIcon: {
    height: 52,
    resizeMode: 'contain',
    width: 52,
  },
  emptyIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
});