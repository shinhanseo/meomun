// frontend/src/features/auth/screens/LoginScreen.tsx

import { useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';
import { useAppleAuth } from '../hooks/useAppleAuth';
import { useKakaoAuth } from '../hooks/useKakaoAuth';

const TERMS_URL =
  'https://quiet-lifter-473.notion.site/38e12450961b800a9b70f6a7623af0c6?pvs=73';
const PRIVACY_POLICY_URL =
  'https://quiet-lifter-473.notion.site/38e12450961b80c1998bf20ffb31002c?pvs=73';

function openExternalLink(url: string) {
  void Linking.openURL(url);
}

export function LoginScreen() {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

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
  const canSignIn = isTermsAgreed && isPrivacyAgreed && !isLoading;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../../assets/icons/logo.png')}
          style={styles.image}
        />

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
            !canSignIn && styles.disabledButton,
          ]}
          onPress={signInWithKakao}
          disabled={!canSignIn}
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
              !canSignIn && styles.disabledButton,
            ]}
            onPress={signInWithApple}
            disabled={!canSignIn}
          >
            <Text style={styles.appleButtonText}>
              {isAppleLoading ? '로그인 중...' : 'Apple로 계속하기'}
            </Text>
          </Pressable>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#E5E7EB',
            }}
          />

          <Text
            style={{
              marginHorizontal: 12,
              color: '#9CA3AF',
              fontSize: 14,
            }}
          >
            또는
          </Text>

          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: '#E5E7EB',
            }}
          />
        </View>
      </View>

      <View style={styles.agreementArea}>
        <AgreementCheckbox
          checked={isTermsAgreed}
          label="서비스 이용약관에 동의합니다. (필수)"
          linkLabel="보기"
          onPress={() => setIsTermsAgreed((value) => !value)}
          onPressLink={() => openExternalLink(TERMS_URL)}
        />

        <AgreementCheckbox
          checked={isPrivacyAgreed}
          label="개인정보 처리방침에 동의합니다. (필수)"
          linkLabel="보기"
          onPress={() => setIsPrivacyAgreed((value) => !value)}
          onPressLink={() => openExternalLink(PRIVACY_POLICY_URL)}
        />

        <Text style={styles.agreementNotice}>
          위치 권한은 장소 기반 기록을 만들 때 별도로 요청돼요.
        </Text>
      </View>
    </View>
  );
}

interface AgreementCheckboxProps {
  checked: boolean;
  label: string;
  linkLabel: string;
  onPress: () => void;
  onPressLink: () => void;
}

function AgreementCheckbox({
  checked,
  label,
  linkLabel,
  onPress,
  onPressLink,
}: AgreementCheckboxProps) {
  return (
    <View style={styles.agreementRow}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        style={styles.checkboxTouchArea}
        onPress={onPress}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <Text style={styles.agreementLabel}>{label}</Text>
      </Pressable>

      <Pressable hitSlop={8} onPress={onPressLink}>
        <Text style={styles.agreementButtonText}>{linkLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 44,
    paddingHorizontal: 28,
    paddingTop: 70,
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
    marginTop: 10,
  },
  title: {
    color: semanticColor.primary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
    textAlign: 'center',
  },
  description: {
    color: semanticColor.textMuted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 2,
    marginBottom: 18,
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
  image: {
    height: 290,
    marginTop: 8,
    width: '100%',
  },
  agreementArea: {
    gap: 10,
  },
  agreementRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  checkboxTouchArea: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: semanticColor.surface,
    borderColor: color.gray[300],
    borderRadius: 6,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: semanticColor.primary,
    borderColor: semanticColor.primary,
  },
  checkboxMark: {
    color: color.white,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  agreementLabel: {
    color: semanticColor.textSecondary,
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
  },
  agreementNotice: {
    color: semanticColor.textMuted,
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 32,
  },
  agreementButtonText: {
    color: semanticColor.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
