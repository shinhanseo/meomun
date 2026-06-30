import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { semanticColor } from '../../shared/constants/color';
import { useAuthBootstrap } from '../../features/auth/hooks/useAuthBootstrap';
import { useAuthStore } from '../../features/auth/store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainStackNavigator } from './MainStackNavigator';
import { MainStackParamList } from './MainStackNavigator';

const linking: LinkingOptions<MainStackParamList> = {
  prefixes: ['meomun://'],
  config: {
    screens: {
      RecordWrite: 'record/new',
      RecordDetail: 'record/:recordId',
      MainTabs: {
        screens: {
          Home: 'home',
          Archive: {
            screens: {
              ArchiveHome: 'records/today',
            },
          },
          Stats: 'stats',
          Profile: 'profile',
        },
      },
    },
  },
};

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
    <NavigationContainer linking={linking}>
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
