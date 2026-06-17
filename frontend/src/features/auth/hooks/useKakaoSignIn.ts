import { useState } from 'react';

import { tokenStorage } from '../../../shared/api/tokenStorage';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export function useKakaoSignIn() {
  const setSession = useAuthStore((state) => state.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const signInWithKakaoToken = async (kakaoAccessToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.loginWithKakao({ kakaoAccessToken });

      await tokenStorage.setRefreshToken(response.refreshToken);

      setSession({
        accessToken: response.accessToken,
        user: response.user,
      });
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithKakaoToken,
    isLoading,
    error,
  };
}