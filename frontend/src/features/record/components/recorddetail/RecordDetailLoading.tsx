import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';

export function RecordDetailLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={semanticColor.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColor.background,
  },
});