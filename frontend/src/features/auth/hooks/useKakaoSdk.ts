import { login } from '@react-native-seoul/kakao-login';

export function useKakaoSdk() {
  const getKakaoAccessToken = async (): Promise<string> => {
    const token = await login();
    return token.accessToken;
  };

  return {
    getKakaoAccessToken,
  };
}
