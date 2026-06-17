import { NavigationContainer } from '@react-navigation/native';

import { useAuthStore } from '../../features/auth/store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';

export function RootNavigator() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <NavigationContainer>
      {accessToken ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
