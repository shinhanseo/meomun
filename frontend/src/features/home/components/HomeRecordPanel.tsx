import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';
import { emotionMeta } from '../../../shared/constants/emotionMeta';
import { emotionMarkerMeta } from '../constants/emotionMarker';
import type { MapRecord } from '../types/home.types';

type HomeRecordPanelProps = {
  mode: 'latest' | 'selected';
  record: MapRecord;
  onPressDetail: () => void;
};

export function HomeRecordPanel({
  mode,
  record,
  onPressDetail,
}: HomeRecordPanelProps) {
  const markerMeta = emotionMarkerMeta[record.emotion];
  const emotionInfo = emotionMeta[record.emotion];
  const emotionColor = markerMeta.color;
  const emotionText = emotionInfo.label;
  const recordedAt = new Date(record.recordedAt);

  const formattedDate = `${recordedAt.getFullYear()}.${String(
    recordedAt.getMonth() + 1,
  ).padStart(2, '0')}.${String(recordedAt.getDate()).padStart(2, '0')}`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>
            {mode === 'selected' ? '선택한 기록' : '최근 기록'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {mode === 'selected'
              ? '지도에서 고른 감정을 열어볼까요?'
              : '가장 최근에 머문 감정이에요.'}
          </Text>
        </View>

        <Pressable onPress={onPressDetail} hitSlop={8}>
          <Text style={styles.viewAll}>자세히</Text>
        </Pressable>
      </View>

      <Pressable style={styles.recordRow} onPress={onPressDetail}>
        <View style={styles.thumbnailFrame}>
          {record.thumbnailImage ? (
            <Image
              source={{ uri: record.thumbnailImage.imageUrl }}
              style={styles.thumbnail}
            />
          ) : (
            <View
              style={[
                styles.thumbnailPlaceholder,
                { backgroundColor: `${emotionColor}1F` },
              ]}
            >
              <Image
                source={markerMeta.image}
                style={styles.placeholderIcon}
              />
            </View>
          )}

          <View
            style={[
              styles.thumbnailEmotion,
              { backgroundColor: `${emotionColor}E6` },
            ]}
          >
            <Image
              source={markerMeta.image}
              style={styles.thumbnailEmotionIcon}
            />
          </View>
        </View>

        <View style={styles.recordContent}>
          <View
            style={[
              styles.emotionBadge,
              { backgroundColor: `${emotionColor}22` },
            ]}
          >
            <Image source={emotionInfo.icon} style={styles.badgeIcon} />
            <Text style={[styles.emotionText, { color: emotionColor }]}>
              {emotionText}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {record.title}
          </Text>

          {record.content ? (
            <Text style={styles.content} numberOfLines={1}>
              “{record.content}”
            </Text>
          ) : null}

          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 30,
    borderWidth: 1,
    bottom: 112,
    elevation: 12,
    left: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    position: 'absolute',
    right: 20,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    zIndex: 20,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: color.gray[300],
    borderRadius: 999,
    height: 5,
    marginBottom: 16,
    width: 44,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: color.purple[900],
    fontSize: 16,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: semanticColor.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  viewAll: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    color: color.purple[600],
    fontSize: 12,
    overflow: 'hidden',
    paddingHorizontal: 11,
    paddingVertical: 6,
    fontWeight: '800',
  },
  thumbnailFrame: {
    height: 96,
    position: 'relative',
    width: 112,
  },
  thumbnailEmotion: {
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 2,
    bottom: -6,
    height: 34,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    width: 34,
  },
  thumbnailEmotionIcon: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  badgeIcon: {
    height: 15,
    resizeMode: 'contain',
    width: 15,
  },
  placeholderIcon: {
    height: 48,
    resizeMode: 'contain',
    width: 48,
  },
  recordRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 15,
  },
  thumbnail: {
    backgroundColor: color.gray[100],
    borderRadius: 18,
    height: 96,
    width: 112,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    borderRadius: 18,
    height: 96,
    justifyContent: 'center',
    width: 112,
  },
  recordContent: {
    flex: 1,
    minWidth: 0,
  },
  emotionBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  emotionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 5,
  },
  content: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  date: {
    color: semanticColor.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
});
