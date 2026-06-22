import { Image, StyleSheet, View } from 'react-native';

import {
  emotionMarkerMeta,
  type EmotionType,
} from '../constants/emotionMarker';

type EmotionMapMarkerProps = {
  emotion: EmotionType;
  isSelected?: boolean;
};

export function EmotionMapMarker({
  emotion,
  isSelected = false,
}: EmotionMapMarkerProps) {
  const meta = emotionMarkerMeta[emotion];

  return (
    <View
      style={[
        styles.wrapper,
        isSelected && styles.selectedWrapper,
      ]}
    >
      <View
        style={[
          styles.glow,
          {
            backgroundColor: meta.color,
          },
        ]}
      />

      <View
        style={[
          styles.pin,
          {
            backgroundColor: meta.color,
          },
        ]}
      >
        <Image
          source={meta.image}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View
        style={[
          styles.tail,
          {
            backgroundColor: meta.color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    height: 64,
    justifyContent: 'flex-start',
    width: 56,
  },
  selectedWrapper: {
    transform: [{ scale: 1.12 }],
  },
  glow: {
    borderRadius: 28,
    bottom: 2,
    height: 42,
    opacity: 0.22,
    position: 'absolute',
    width: 42,
  },
  pin: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    width: 48,
  },
  image: {
    height: 30,
    width: 30,
  },
  tail: {
    borderBottomRightRadius: 4,
    height: 14,
    marginTop: -7,
    transform: [{ rotate: '45deg' }],
    width: 14,
  },
});