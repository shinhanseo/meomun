import {
  Image,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, semanticColor } from '../../../shared/constants/color';
import {
  EMOTION_CODES,
  emotionMeta,
  type EmotionCode,
} from '../../../shared/constants/emotionMeta';

type HomeEmotionFilterProps = {
  selectedEmotion: EmotionCode | null;
  onSelectEmotion: (emotion: EmotionCode | null) => void;
};

export function HomeEmotionFilter({
  selectedEmotion,
  onSelectEmotion,
}: HomeEmotionFilterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          top: insets.top + 164,
        },
      ]}
    >
      <ScrollView
        horizontal
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}
      >
        <FilterChip
          label="전체"
          isSelected={!selectedEmotion}
          onPress={() => onSelectEmotion(null)}
        />

        {EMOTION_CODES.map((emotion) => {
          const meta = emotionMeta[emotion];

          return (
            <FilterChip
              key={emotion}
              label={meta.label}
              icon={meta.icon}
              color={meta.color}
              isSelected={selectedEmotion === emotion}
              onPress={() => onSelectEmotion(emotion)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function FilterChip({
  label,
  icon,
  color: tintColor = color.purple[600],
  isSelected,
  onPress,
}: {
  label: string;
  icon?: ImageSourcePropType;
  color?: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        isSelected && [
          styles.chipSelected,
          { borderColor: `${tintColor}55` },
        ],
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      {icon ? (
        <Image source={icon} style={styles.icon} />
      ) : (
        <View style={[styles.allDot, { backgroundColor: tintColor }]} />
      )}
      <Text
        style={[
          styles.chipText,
          isSelected && { color: tintColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  allDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    height: 36,
    paddingHorizontal: 12,
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  chipSelected: {
    backgroundColor: color.white,
    borderWidth: 1.5,
  },
  chipText: {
    color: semanticColor.textSecondary,
    fontSize: 12,
    fontWeight: '900',
  },
  content: {
    gap: 8,
    paddingHorizontal: 20,
  },
  icon: {
    height: 17,
    resizeMode: 'contain',
    width: 17,
  },
  pressed: {
    opacity: 0.72,
  },
  wrapper: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 16,
  },
});
