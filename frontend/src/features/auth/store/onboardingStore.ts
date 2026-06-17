import { create } from 'zustand';

import { onboardingStorage } from '../../../shared/storage/onboardingStorage';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  isLoading: boolean;

  loadHasSeenOnboarding: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasSeenOnboarding: false,
  isLoading: true,

  loadHasSeenOnboarding: async () => {
    const hasSeenOnboarding =
      await onboardingStorage.getHasSeenOnboarding();

    set({
      hasSeenOnboarding,
      isLoading: false,
    });
  },

  completeOnboarding: async () => {
    await onboardingStorage.setHasSeenOnboarding();

    set({
      hasSeenOnboarding: true,
    });
  },

  resetOnboarding: async () => {
    await onboardingStorage.resetHasSeenOnboarding();

    set({
      hasSeenOnboarding: false,
    });
  },
}));