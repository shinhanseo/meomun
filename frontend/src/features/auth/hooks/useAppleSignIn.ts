import { useState } from 'react';

import { tokenStorage } from '../../../shared/api/tokenStorage';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import type { AppleLoginRequest } from '../types/auth.types';

export function useAppleSignIn() {
  const setSession = useAuthStore((state) => state.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const signInWithAppleCredential = async (body: AppleLoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.loginWithApple(body);

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
    signInWithAppleCredential,
    isLoading,
    error,
  };
}
