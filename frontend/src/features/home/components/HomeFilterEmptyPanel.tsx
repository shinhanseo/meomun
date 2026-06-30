import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

type HomeFilterEmptyPanelProps = {
  emotionLabel: string;
  onPressClear: () => void;
};

export function HomeFilterEmptyPanel({
  emotionLabel,
  onPressClear,
}: HomeFilterEmptyPanelProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.handle} />

      <Text style={styles.title}>{emotionLabel} 기록이 없어요</Text>
      <Text style={styles.description}>
        다른 감정을 고르거나 전체 기록을 다시 볼 수 있어요.
      </Text>

      <Pressable style={styles.button} onPress={onPressClear}>
        <Text style={styles.buttonText}>전체 보기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: color.purple[50],
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonText: {
    color: color.purple[600],
    fontSize: 13,
    fontWeight: '800',
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
    textAlign: 'center',
  },
  handle: {
    backgroundColor: color.gray[300],
    borderRadius: 999,
    height: 5,
    marginBottom: 18,
    width: 44,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  wrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 28,
    bottom: 112,
    elevation: 12,
    left: 20,
    paddingBottom: 22,
    paddingHorizontal: 20,
    paddingTop: 14,
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
});
