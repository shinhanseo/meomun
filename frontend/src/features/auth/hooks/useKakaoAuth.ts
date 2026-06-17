import { useState } from 'react';

import { useKakaoSdk } from './useKakaoSdk';
import { useKakaoSignIn } from './useKakaoSignIn';

export function useKakaoAuth() {
  const { getKakaoAccessToken } = useKakaoSdk();
  const {
    signInWithKakaoToken,
    isLoading: isSigningIn,
    error: signInError,
  } = useKakaoSignIn();

  const [isSdkLoading, setIsSdkLoading] = useState(false);
  const [sdkError, setSdkError] = useState<unknown>(null);

  const signInWithKakao = async () => {
    try {
      setIsSdkLoading(true);
      setSdkError(null);

      const kakaoAccessToken = await getKakaoAccessToken();
      await signInWithKakaoToken(kakaoAccessToken);
    } catch (error) {
      setSdkError(error);
      throw error;
    } finally {
      setIsSdkLoading(false);
    }
  };

  return {
    signInWithKakao,
    isLoading: isSdkLoading || isSigningIn,
    error: sdkError ?? signInError,
  };
}
