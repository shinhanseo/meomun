import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_SEEN_ONBOARDING_KEY = 'hasSeenOnboarding';

export const onboardingStorage = {
  getHasSeenOnboarding: async () => {
    const value = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING_KEY);
    return value === 'true';
  },

  setHasSeenOnboarding: async () => {
    await AsyncStorage.setItem(HAS_SEEN_ONBOARDING_KEY, 'true');
  },

  resetHasSeenOnboarding: async () => {
    await AsyncStorage.removeItem(HAS_SEEN_ONBOARDING_KEY);
  },
};