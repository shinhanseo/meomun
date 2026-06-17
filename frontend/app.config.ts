import type { ExpoConfig } from 'expo/config';

const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

if (!kakaoNativeAppKey) {
  throw new Error('EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY is not defined');
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
  plugins: [
    'expo-secure-store',
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
          ],
        },
      },
    ],
  ],
};

export default config;
