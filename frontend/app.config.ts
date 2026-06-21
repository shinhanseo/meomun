import type { ExpoConfig } from 'expo/config';

const kakaoNativeAppKey =
  process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ??
  '21a5930fdd4ec1deced66f33c3893668';

const naverMapClientId = process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID;

if (!naverMapClientId) {
  throw new Error('EXPO_PUBLIC_NAVER_MAP_CLIENT_ID is not defined');
}

const config: ExpoConfig = {
  name: 'Meomun',
  slug: 'meomun',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: 'com.hanseo.meomun',
    usesAppleSignIn: true,
  },
  android: {
    package: 'com.hanseo.meomun',
  },
  extra: {
    naverMapClientId,
  },
  plugins: [
    'expo-secure-store',
    'expo-apple-authentication',
    [
      '@mj-studio/react-native-naver-map',
      {
        client_id: naverMapClientId,
      },
    ],
    [
      '@react-native-seoul/kakao-login',
      {
        kakaoAppKey: kakaoNativeAppKey,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: [
            'https://devrepo.kakao.com/nexus/content/groups/public/',
            'https://repository.map.naver.com/archive/maven',
          ],
        },
      },
    ],
  ],
};

export default config;
