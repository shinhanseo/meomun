import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

type HomeEmptyPanelProps = {
  onPressCreate?: () => void;
};

export function HomeEmptyPanel({ onPressCreate }: HomeEmptyPanelProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.handle} />

      <Text style={styles.title}>아직 남긴 기록이 없어요</Text>
      <Text style={styles.description}>
        오늘 머문 장소에 감정을 하나 남겨보세요.
      </Text>

      <Pressable style={styles.button} onPress={onPressCreate}>
        <Text style={styles.buttonText}>첫 기록 남기기</Text>
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
    paddingBottom: 22,
    alignItems: 'center',
    shadowColor: color.purple[700],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: color.gray[300],
    marginBottom: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: semanticColor.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: semanticColor.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  button: {
    borderRadius: 999,
    backgroundColor: color.purple[500],
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: color.white,
  },
});