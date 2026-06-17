import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

interface AppleSdkCredential {
  identityToken: string;
  nonce: string;
  nickname?: string;
}

function getAppleNickname(
  fullName: AppleAuthentication.AppleAuthenticationFullName | null,
) {
  return fullName?.nickname ?? fullName?.givenName ?? undefined;
}

export function useAppleSdk() {
  const getAppleCredential = async (): Promise<AppleSdkCredential> => {
    const isAvailable = await AppleAuthentication.isAvailableAsync();

    if (!isAvailable) {
      throw new Error('Apple Sign In is not available on this device');
    }

    const nonce = Crypto.randomUUID();
    const credential = await AppleAuthentication.signInAsync({
      nonce,
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple identityToken is missing');
    }

    return {
      identityToken: credential.identityToken,
      nonce,
      nickname: getAppleNickname(credential.fullName),
    };
  };

  return {
    getAppleCredential,
  };
}
