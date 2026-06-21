import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';

export function RecordDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>기록 상세</Text>
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
