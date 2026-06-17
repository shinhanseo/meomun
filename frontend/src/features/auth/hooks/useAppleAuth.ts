import { useState } from 'react';

import { useAppleSdk } from './useAppleSdk';
import { useAppleSignIn } from './useAppleSignIn';

export function useAppleAuth() {
  const { getAppleCredential } = useAppleSdk();
  const {
    signInWithAppleCredential,
    isLoading: isSigningIn,
    error: signInError,
  } = useAppleSignIn();

  const [isSdkLoading, setIsSdkLoading] = useState(false);
  const [sdkError, setSdkError] = useState<unknown>(null);

  const signInWithApple = async () => {
    try {
      setIsSdkLoading(true);
      setSdkError(null);

      const credential = await getAppleCredential();
      await signInWithAppleCredential(credential);
    } catch (error) {
      setSdkError(error);
      throw error;
    } finally {
      setIsSdkLoading(false);
    }
  };

  return {
    signInWithApple,
    isLoading: isSdkLoading || isSigningIn,
    error: sdkError ?? signInError,
  };
}
