import { loginWithKakaoAccount } from '@react-native-seoul/kakao-login';

export function useKakaoSdk() {
  const getKakaoAccessToken = async (): Promise<string> => {
    const token = await loginWithKakaoAccount();
    return token.accessToken;
  };

  return {
    getKakaoAccessToken,
  };
}
