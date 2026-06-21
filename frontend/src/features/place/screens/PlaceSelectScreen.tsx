import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';

export function PlaceSelectScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>장소 선택</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
});
