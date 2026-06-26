import { MapPin } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { emotionMeta } from '../../../../shared/constants/emotionMeta';
import type { ArchiveRecordListItem } from '../../types';

interface AllArchiveRecordCardProps {
  record: ArchiveRecordListItem;
  onPress: (recordId: string) => void;
}

export function AllArchiveRecordCard({
  record,
  onPress,
}: AllArchiveRecordCardProps) {
  const emotion = emotionMeta[record.emotion];
  const formattedDate = formatArchiveRecordDate(record.recordedAt);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => onPress(record.id)}
    >
      {record.thumbnailImage ? (
        <Image
          source={{ uri: record.thumbnailImage.imageUrl }}
          style={styles.thumbnail}
        />
      ) : (
        <View
          style={[
            styles.thumbnail,
            styles.thumbnailFallback,
            { backgroundColor: `${emotion.color}1F` },
          ]}
        >
          <Image source={emotion.icon} style={styles.fallbackEmotionIcon} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.date} numberOfLines={1}>
          {formattedDate}
        </Text>

        <Text style={styles.title} numberOfLines={1}>
          {record.title}
        </Text>

        <Text style={styles.description} numberOfLines={3}>
          {record.content || '남겨진 기록 내용이 없어요.'}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.emotionBadge, { backgroundColor: `${emotion.color}18` }]}>
            <Image source={emotion.icon} style={styles.emotionIcon} />
            <Text style={[styles.emotionText, { color: emotion.color }]}>
              {emotion.label}
            </Text>
          </View>

          <View style={styles.placeBadge}>
            <MapPin color="#9B8BC0" size={13} strokeWidth={2.3} />
            <Text style={styles.placeText} numberOfLines={1}>
              {record.placeName}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function formatArchiveRecordDate(value: string) {
  const date = new Date(value);
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const period = date.getHours() < 12 ? '오전' : '오후';
  const hour = date.getHours() % 12 || 12;
  const minute = `${date.getMinutes()}`.padStart(2, '0');

  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}   ${weekdays[date.getDay()]}   ${period} ${hour}:${minute}`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 12,
    minHeight: 132,
    padding: 10,
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
    minWidth: 0,
    paddingBottom: 4,
    paddingLeft: 14,
    paddingRight: 28,
    paddingTop: 8,
  },
  date: {
    color: '#8E6CE5',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 7,
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 9,
  },
  emotionBadge: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emotionIcon: {
    height: 14,
    resizeMode: 'contain',
    width: 14,
  },
  emotionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  fallbackEmotionIcon: {
    height: 42,
    resizeMode: 'contain',
    width: 42,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  moreIcon: {
    bottom: 20,
    position: 'absolute',
    right: 15,
  },
  placeBadge: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    minWidth: 0,
  },
  placeText: {
    color: '#8E849F',
    flexShrink: 1,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
  thumbnail: {
    borderRadius: 14,
    height: 112,
    width: 112,
  },
  thumbnailFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#302455',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 7,
  },
});
