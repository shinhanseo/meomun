// frontend/src/features/auth/screens/LoginScreen.tsx

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';
import { useAppleAuth } from '../hooks/useAppleAuth';
import { useKakaoAuth } from '../hooks/useKakaoAuth';

export function LoginScreen() {
  const {
    signInWithKakao,
    isLoading: isKakaoLoading,
    error: kakaoError,
  } = useKakaoAuth();

  const {
    signInWithApple,
    isLoading: isAppleLoading,
    error: appleError,
  } = useAppleAuth();

  const isLoading = isKakaoLoading || isAppleLoading;
  const error = kakaoError ?? appleError;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>머문</Text>

        <View style={styles.textArea}>
          <Text style={styles.title}>어서오세요</Text>
          <Text style={styles.description}>
            당신이 머문 감정을 기록해보세요
          </Text>
        </View>
      </View>

      <View style={styles.buttonArea}>
        {error ? (
          <Text style={styles.errorText}>
            로그인 중 문제가 발생했어요. 다시 시도해주세요.
          </Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            styles.kakaoButton,
            pressed && styles.pressedButton,
            isLoading && styles.disabledButton,
          ]}
          onPress={signInWithKakao}
          disabled={isLoading}
        >
          <Text style={styles.kakaoButtonText}>
            {isKakaoLoading ? '로그인 중...' : '카카오로 계속하기'}
          </Text>
        </Pressable>

        {Platform.OS === 'ios' ? (
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              styles.appleButton,
              pressed && styles.pressedButton,
              isLoading && styles.disabledButton,
            ]}
            onPress={signInWithApple}
            disabled={isLoading}
          >
            <Text style={styles.appleButtonText}>
              {isAppleLoading ? '로그인 중...' : 'Apple로 계속하기'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 56,
    paddingHorizontal: 28,
    paddingTop: 120,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    color: semanticColor.primary,
    fontSize: 44,
    fontWeight: '800',
  },
  textArea: {
    alignItems: 'center',
    marginTop: 52,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
    textAlign: 'center',
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 18,
    textAlign: 'center',
  },
  buttonArea: {
    gap: 14,
  },
  loginButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    width: '100%',
  },
  kakaoButton: {
    backgroundColor: '#FEE500',
  },
  kakaoButtonText: {
    color: '#191600',
    fontSize: 17,
    fontWeight: '700',
  },
  appleButton: {
    backgroundColor: color.black,
  },
  appleButtonText: {
    color: color.white,
    fontSize: 17,
    fontWeight: '700',
  },
  pressedButton: {
    opacity: 0.82,
  },
  disabledButton: {
    opacity: 0.55,
  },
  errorText: {
    color: semanticColor.danger,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});