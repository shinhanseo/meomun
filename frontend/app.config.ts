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
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        '현재 위치를 기준으로 주변 기록을 보여주기 위해 위치 권한이 필요합니다.',
      NSPhotoLibraryUsageDescription:
        '기록에 추가할 사진을 선택하기 위해 사진 보관함 접근 권한이 필요합니다.',
    },
  },
  android: {
    package: 'com.hanseo.meomun',
    softwareKeyboardLayoutMode: 'resize',
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
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          '현재 위치를 기준으로 주변 기록을 보여주기 위해 위치 권한이 필요합니다.',
      },
    ],
  ],
};

export default config;
