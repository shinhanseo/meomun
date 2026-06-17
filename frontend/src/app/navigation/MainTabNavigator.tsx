import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../shared/constants/color';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈</Text>
      <Text style={styles.description}>로그인이 완료되었어요.</Text>
    </View>
  );
}

export function MainTabNavigator() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 12,
    textAlign: 'center',
  },
});
