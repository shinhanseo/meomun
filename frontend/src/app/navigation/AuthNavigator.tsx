import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { OnboardingScreen } from '../../features/auth/screens/OnboardingScreen';
import { useOnboardingStore } from '../../features/auth/store/onboardingStore';
import { semanticColor } from '../../shared/constants/color';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const hasSeenOnboarding = useOnboardingStore(
    (state) => state.hasSeenOnboarding,
  );
  const isLoading = useOnboardingStore((state) => state.isLoading);
  const loadHasSeenOnboarding = useOnboardingStore(
    (state) => state.loadHasSeenOnboarding,
  );

  useEffect(() => {
    void loadHasSeenOnboarding();
  }, [loadHasSeenOnboarding]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={semanticColor.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={hasSeenOnboarding ? 'Login' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'center',
  },
});
