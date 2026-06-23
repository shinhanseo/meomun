import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { color, semanticColor } from '../../../shared/constants/color';

export function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <LinearGradient
        colors={[
          'rgba(247, 241, 255, 0.92)',
          'rgba(247, 241, 255, 0.55)',
          'rgba(247, 241, 255, 0)',
        ]}
        locations={[0, 0.55, 1]}
        style={styles.background}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          오늘은,{'\n'}어디에 머물렀나요?
        </Text>
        <Text style={styles.description}>
          당신의 순간을 지도 위에 남겨보세요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    minHeight: 238,
    paddingHorizontal: 26,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  background: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  content: {
    marginTop: 18,
  },
  title: {
    color: color.purple[900],
    fontSize: 29,
    fontWeight: '700',
    lineHeight: 39,
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 10,
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.72)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 8,
  },
});
