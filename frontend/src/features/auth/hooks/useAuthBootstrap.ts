import { useEffect } from 'react';

import { tokenStorage } from '../../../shared/api/tokenStorage';
import { env } from '../../../shared/config/env';
import { onboardingStorage } from '../../../shared/storage/onboardingStorage';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export function useAuthBootstrap() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (env.resetAppStateOnBoot) {
          await tokenStorage.removeRefreshToken();
          await onboardingStorage.resetHasSeenOnboarding();
          clearSession();
          return;
        }

        const refreshToken = await tokenStorage.getRefreshToken();

        if (!refreshToken) {
          clearSession();
          return;
        }

        const response = await authApi.refreshToken({ refreshToken });

        await tokenStorage.setRefreshToken(response.refreshToken);
        setAccessToken(response.accessToken);
      } catch (error) {
        await tokenStorage.removeRefreshToken();
        clearSession();
      } finally {
        setInitializing(false);
      }
    };

    void bootstrap();
  }, [clearSession, setAccessToken, setInitializing]);
}
