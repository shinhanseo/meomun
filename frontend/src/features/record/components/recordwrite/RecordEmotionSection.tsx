import { Heart } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import {
  emotionMeta,
  type EmotionCode,
} from '../../../../shared/constants/emotionMeta';

interface RecordEmotionSectionProps {
  selectedEmotion: EmotionCode | null;
  onSelectEmotion: (emotion: EmotionCode) => void;
}

const EMOTION_ROWS = [
  ['ANGRY', 'ANXIOUS', 'CALM', 'FLUTTER'],
  ['HAPPY', 'REFLECTIVE', 'SAD', 'TIRED'],
] satisfies EmotionCode[][];

export function RecordEmotionSection({
  selectedEmotion,
  onSelectEmotion,
}: RecordEmotionSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Heart color="#9B8BC0" size={22} strokeWidth={2} />
          <Text style={styles.label}>감정</Text>
        </View>

        <Text style={styles.helper}>가장 가까운 감정을 선택해보세요</Text>
      </View>

      <View style={styles.grid}>
        {EMOTION_ROWS.map((row) => (
          <View key={row.join('-')} style={styles.row}>
            {row.map((emotion) => {
              const meta = emotionMeta[emotion];
              const isSelected = selectedEmotion === emotion;

              return (
                <Pressable
                  key={emotion}
                  style={({ pressed }) => [
                    styles.emotionButton,
                    isSelected && [
                      styles.emotionButtonSelected,
                      { borderColor: meta.color },
                    ],
                    pressed && styles.emotionButtonPressed,
                  ]}
                  onPress={() => onSelectEmotion(emotion)}
                >
                  <Image source={meta.icon} style={styles.emotionIcon} />

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.emotionLabel,
                      isSelected && { color: meta.color },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  helper: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  emotionButton: {
    alignItems: 'center',
    backgroundColor: '#F8F5FA',
    borderColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1.5,
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 52,
    justifyContent: 'center',
    minWidth: 0,
  },
  emotionButtonSelected: {
    backgroundColor: '#FFFFFF',
  },
  emotionButtonPressed: {
    opacity: 0.82,
  },
  emotionIcon: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
  },
  emotionLabel: {
    color: semanticColor.textPrimary,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '700',
  },
});