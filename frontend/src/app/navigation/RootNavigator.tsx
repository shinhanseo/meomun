import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { semanticColor } from '../../shared/constants/color';
import { useAuthBootstrap } from '../../features/auth/hooks/useAuthBootstrap';
import { useAuthStore } from '../../features/auth/store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainStackNavigator } from './MainStackNavigator';

export function RootNavigator() {
  useAuthBootstrap();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={semanticColor.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {accessToken ? <MainStackNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'center',
  },
});
