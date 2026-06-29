import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { color } from '../../../shared/constants/color';

interface ProfileHeaderProps {
  nickname: string;
  joinedDayCount: number | null;
  isLoading?: boolean;
}

export function ProfileHeader({
  nickname,
  joinedDayCount,
  isLoading = false,
}: ProfileHeaderProps) {
  const displayName = isLoading ? '불러오는 중' : nickname;
  const joinedText =
    joinedDayCount === null
      ? '머문과 함께한 시간을 불러오고 있어요.'
      : `머문과 함께한 지 ${joinedDayCount}일`;

  return (
    <LinearGradient
      colors={['#7658CF', '#AA86EA', '#F2BFD9']}
      locations={[0, 0.56, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.ribbonTop} />
      <View style={styles.ribbonBottom} />
      <View style={styles.sparkleOne} />
      <View style={styles.sparkleTwo} />
      <View style={styles.sparkleThree} />

      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>MY MEOMUN</Text>
        <View style={styles.joinedBadge}>
          <Text style={styles.joinedBadgeText}>{joinedText}</Text>
        </View>
      </View>

      <View style={styles.nameArea}>
        <Text style={styles.greeting}>안녕하세요,</Text>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          numberOfLines={1}
          style={styles.nickname}
        >
          {displayName}님
        </Text>
      </View>

      <Text style={styles.description}>
        오늘도 당신이 머문 순간들이 차곡차곡 쌓이고 있어요.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'rgba(255, 255, 255, 0.26)',
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 22,
    minHeight: 188,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: color.purple[600],
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.16,
    shadowRadius: 22,
  },
  ribbonTop: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    height: 86,
    position: 'absolute',
    right: -36,
    top: -20,
    transform: [{ rotate: '-18deg' }],
    width: 190,
  },
  ribbonBottom: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    bottom: -34,
    height: 92,
    left: -42,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
    width: 220,
  },
  sparkleOne: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 2,
    height: 5,
    position: 'absolute',
    right: 86,
    top: 28,
    transform: [{ rotate: '45deg' }],
    width: 5,
  },
  sparkleTwo: {
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: 2,
    height: 4,
    position: 'absolute',
    right: 122,
    top: 54,
    transform: [{ rotate: '45deg' }],
    width: 4,
  },
  sparkleThree: {
    backgroundColor: 'rgba(255, 255, 255, 0.48)',
    borderRadius: 2,
    bottom: 36,
    height: 4,
    position: 'absolute',
    right: 28,
    transform: [{ rotate: '45deg' }],
    width: 4,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  eyebrow: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
  },
  joinedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.34)',
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 1,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  joinedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 15,
  },
  nameArea: {
    marginTop: 24,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  nickname: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    marginTop: 2,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    marginTop: 14,
  },
});
