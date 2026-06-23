import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';
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
  const emotionColor = emotionMarkerMeta[record.emotion].color;
  const recordedAt = new Date(record.recordedAt);

  const formattedDate = `${recordedAt.getFullYear()}.${String(
    recordedAt.getMonth() + 1,
  ).padStart(2, '0')}.${String(recordedAt.getDate()).padStart(2, '0')}`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          {mode === 'selected' ? '선택한 기록' : '최근 기록'}
        </Text>

        <Pressable onPress={onPressDetail} hitSlop={8}>
          <Text style={styles.viewAll}>전체 보기</Text>
        </Pressable>
      </View>

      <Pressable style={styles.recordRow} onPress={onPressDetail}>
        {record.thumbnailImage ? (
          <Image
            source={{ uri: record.thumbnailImage.imageUrl }}
            style={styles.thumbnail}
          />
        ) : (
          <View style={styles.thumbnailPlaceholder} />
        )}

        <View style={styles.recordContent}>
          <View
            style={[
              styles.emotionBadge,
              { backgroundColor: `${emotionColor}22` },
            ]}
          >
            <View
              style={[
                styles.emotionDot,
                { backgroundColor: emotionColor },
              ]}
            />
            <Text style={[styles.emotionText, { color: emotionColor }]}>
              {record.emotion}
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
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 112,
    zIndex: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: color.gray[300],
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: color.purple[900],
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: color.gray[500],
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  thumbnail: {
    width: 110,
    height: 92,
    borderRadius: 16,
    backgroundColor: color.gray[100],
  },
  thumbnailPlaceholder: {
    width: 110,
    height: 92,
    borderRadius: 16,
    backgroundColor: color.purple[100],
  },
  recordContent: {
    flex: 1,
    minWidth: 0,
  },
  emotionBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 8,
  },
  emotionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emotionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticColor.textPrimary,
    marginBottom: 5,
  },
  content: {
    fontSize: 13,
    color: semanticColor.textSecondary,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: semanticColor.textMuted,
  },
  detailButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.purple[50],
  },
});