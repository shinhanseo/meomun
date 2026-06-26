import { LinearGradient } from 'expo-linear-gradient';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Search,
  X,
} from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import {
  emotionMeta,
  type EmotionCode,
} from '../../../../shared/constants/emotionMeta';
import type { ArchiveSort } from '../../types';

interface EmotionArchiveDetailHeaderProps {
  emotion: EmotionCode;
  recordCount: number;
  sort: ArchiveSort;
  isSearchOpen: boolean;
  isSortOpen: boolean;
  topInset: number;
  onPressBack: () => void;
  onToggleSearch: () => void;
  onToggleSort: () => void;
  onSelectSort: (sort: ArchiveSort) => void;
}

const EMOTION_ARCHIVE_DESCRIPTIONS: Record<EmotionCode, string> = {
  ANGRY: '마음에 뜨거운 감정이 남았던 순간들.',
  ANXIOUS: '불안하고 흔들렸던 순간들.',
  CALM: '마음이 잔잔하고 고요했던 순간들.',
  FLUTTER: '두근거리고 설레었던 순간들.',
  HAPPY: '기분 좋고 즐거웠던 순간들.',
  REFLECTIVE: '천천히 생각에 잠겼던 순간들.',
  SAD: '마음이 조금 가라앉았던 순간들.',
  TIRED: '몸과 마음이 지쳐있던 순간들.',
};

const SORT_OPTIONS: {
  label: string;
  value: ArchiveSort;
}[] = [
  {
    label: '최신순',
    value: 'latest',
  },
  {
    label: '오래된순',
    value: 'oldest',
  },
];

export function EmotionArchiveDetailHeader({
  emotion,
  recordCount,
  sort,
  isSearchOpen,
  isSortOpen,
  topInset,
  onPressBack,
  onToggleSearch,
  onToggleSort,
  onSelectSort,
}: EmotionArchiveDetailHeaderProps) {
  const emotionInfo = emotionMeta[emotion];
  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? '최신순';

  return (
    <LinearGradient
      colors={['#E9DFFF', '#F7E5F0', '#D8CCFF']}
      locations={[0, 0.62, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, { paddingTop: topInset + 18 }]}
    >
      <View style={styles.heroGlow} />

      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          onPress={onPressBack}
        >
          <ChevronLeft color="#4F426C" size={24} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.topRightControls}>
          <View style={styles.sortWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.heroSortButton,
                pressed && styles.pressed,
              ]}
              onPress={onToggleSort}
            >
              <CalendarDays color="#6A55B3" size={15} strokeWidth={2.4} />
              <Text style={styles.heroSortButtonText}>{selectedSortLabel}</Text>
              <ChevronDown color="#6A55B3" size={14} strokeWidth={2.5} />
            </Pressable>

            {isSortOpen && (
              <View style={styles.sortMenu}>
                {SORT_OPTIONS.map((option) => {
                  const isSelected = option.value === sort;

                  return (
                    <Pressable
                      key={option.value}
                      style={({ pressed }) => [
                        styles.sortOption,
                        pressed && styles.sortOptionPressed,
                      ]}
                      onPress={() => onSelectSort(option.value)}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
                          isSelected && styles.sortOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={onToggleSearch}
          >
            {isSearchOpen ? (
              <X color="#4F426C" size={21} strokeWidth={2.4} />
            ) : (
              <Search color="#4F426C" size={21} strokeWidth={2.4} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.heroContent}>
        <View
          style={[
            styles.emotionCircle,
            { backgroundColor: `${emotionInfo.color}22` },
          ]}
        >
          <Image source={emotionInfo.icon} style={styles.emotionIcon} />
        </View>

        <View style={styles.heroTextArea}>
          <Text style={styles.emotionTitle}>{emotionInfo.label}</Text>
          <Text style={styles.emotionCount}>
            이 감정으로 기록한 순간 {recordCount}개
          </Text>
          <Text style={styles.emotionDescription}>
            {EMOTION_ARCHIVE_DESCRIPTIONS[emotion]}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  emotionCircle: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: 999,
    borderWidth: 1,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  emotionCount: {
    color: '#6E5C9D',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
  },
  emotionDescription: {
    color: '#6F6680',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    marginTop: 10,
  },
  emotionIcon: {
    height: 58,
    resizeMode: 'contain',
    width: 58,
  },
  emotionTitle: {
    color: semanticColor.textPrimary,
    fontSize: 27,
    fontWeight: '900',
  },
  hero: {
    minHeight: 300,
    overflow: 'hidden',
    paddingBottom: 34,
    paddingHorizontal: 24,
    zIndex: 40,
  },
  heroContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 22,
    marginTop: 42,
  },
  heroGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
    borderRadius: 999,
    height: 190,
    position: 'absolute',
    right: -60,
    top: 84,
    width: 190,
  },
  heroSortButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    height: 42,
    paddingHorizontal: 13,
  },
  heroSortButtonText: {
    color: '#6A55B3',
    fontSize: 13,
    fontWeight: '900',
  },
  heroTextArea: {
    flex: 1,
    minWidth: 0,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  pressed: {
    opacity: 0.72,
  },
  sortMenu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE7F3',
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 118,
    paddingVertical: 6,
    position: 'absolute',
    right: 0,
    top: 48,
    zIndex: 70,
  },
  sortOption: {
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  sortOptionPressed: {
    backgroundColor: '#F7F3FF',
  },
  sortOptionText: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '800',
  },
  sortOptionTextSelected: {
    color: '#7C6FD6',
  },
  sortWrapper: {
    position: 'relative',
    zIndex: 60,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  topRightControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 60,
  },
});
