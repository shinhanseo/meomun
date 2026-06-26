import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import {
  emotionMeta,
  type EmotionCode,
} from '../../../../shared/constants/emotionMeta';
import type { EmotionArchiveItem } from '../../types';

interface EmotionArchiveItemCardProps {
  item: EmotionArchiveItem;
  onPress?: (emotion: EmotionCode) => void;
}

const EMOTION_ARCHIVE_DESCRIPTIONS: Record<EmotionCode, string> = {
  ANGRY: '마음에 뜨거운 감정이 남았던 순간들',
  ANXIOUS: '불안하고 흔들렸던 순간들',
  CALM: '마음이 잔잔하고 고요했던 순간들',
  FLUTTER: '두근거리고 설레었던 순간들',
  HAPPY: '기분 좋고 즐거웠던 순간들',
  REFLECTIVE: '천천히 생각에 잠겼던 순간들',
  SAD: '마음이 조금 가라앉았던 순간들',
  TIRED: '몸과 마음이 지쳐있던 순간들',
};

export function EmotionArchiveItemCard({
  item,
  onPress,
}: EmotionArchiveItemCardProps) {
  const meta = emotionMeta[item.emotion];
  const description = EMOTION_ARCHIVE_DESCRIPTIONS[item.emotion];

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress?.(item.emotion)}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: `${meta.color}1F`,
          },
        ]}
      >
        <Image source={meta.icon} style={styles.emotionIcon} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{meta.label}</Text>

            {item.isMostRecorded && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>가장 많이 기록한 감정</Text>
              </View>
            )}
          </View>

          <Text style={[styles.percentage, { color: meta.color }]}>
            {item.percentage}%
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: meta.color,
                },
              ]}
            />
          </View>
        </View>

        <Text style={[styles.recordCount, { color: meta.color }]}>
          {item.recordCount}개 기록
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#F2ECFF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#8E6CE5',
    fontSize: 10,
    fontWeight: '800',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  content: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
  emotionIcon: {
    height: 34,
    resizeMode: 'contain',
    width: 34,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 999,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  progressRow: {
    marginTop: 11,
  },
  progressTrack: {
    backgroundColor: '#EEEAF4',
    borderRadius: 999,
    height: 7,
    overflow: 'hidden',
  },
  recordCount: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '900',
  },
  titleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    minWidth: 0,
  },
});