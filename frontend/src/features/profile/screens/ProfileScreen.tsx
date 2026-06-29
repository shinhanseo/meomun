import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Linking, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokenStorage } from '../../../shared/api/tokenStorage';
import { semanticColor } from '../../../shared/constants/color';
import { archiveApi } from '../../archive/api/archiveApi';
import { authApi } from '../../auth/api/authApi';
import { useAuthStore } from '../../auth/store/authStore';
import { profileApi } from '../api/profileApi';
import { ProfileConfirmModal } from '../components/ProfileConfirmModal';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileMenuList } from '../components/ProfileMenuList';
import { ProfileSummaryCard } from '../components/ProfileSummaryCard';

type ConfirmModalType = 'logout' | 'deleteAccount';

const PRIVACY_POLICY_URL =
  'https://quiet-lifter-473.notion.site/38e12450961b80c1998bf20ffb31002c?pvs=73';
const TERMS_OF_SERVICE_URL =
  'https://quiet-lifter-473.notion.site/38e12450961b800a9b70f6a7623af0c6?pvs=73';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isAuthActionPending, setIsAuthActionPending] = useState(false);
  const [confirmModalType, setConfirmModalType] =
    useState<ConfirmModalType | null>(null);

  const userQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: profileApi.getUser,
  });

  const overviewQuery = useQuery({
    queryKey: ['profile', 'archiveOverview'],
    queryFn: () =>
      archiveApi.getAllArchive({
        limit: 1,
      }),
  });

  const user = userQuery.data;
  const stats = overviewQuery.data?.stats;
  const isHeaderLoading = userQuery.isLoading;
  const isSummaryLoading = overviewQuery.isLoading;
  const nickname = user?.nickname || '이름 없는 머문러';
  const joinedDayCount = user?.createdAt
    ? calculateJoinedDayCount(user.createdAt)
    : null;

  const showPreparingAlert = (title: string) => {
    Alert.alert(title, '아직 화면을 준비하고 있어요.');
  };

  const openExternalUrl = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('페이지를 열 수 없어요', '잠시 후 다시 시도해주세요.');
    }
  };

  const handleLogout = () => {
    setConfirmModalType('logout');
  };

  const handleDeleteAccount = () => {
    setConfirmModalType('deleteAccount');
  };

  const handleCloseConfirmModal = () => {
    if (isAuthActionPending) {
      return;
    }

    setConfirmModalType(null);
  };

  const handleConfirmAuthAction = () => {
    if (confirmModalType === 'logout') {
      void submitLogout();
      return;
    }

    if (confirmModalType === 'deleteAccount') {
      void submitDeleteAccount();
    }
  };

  const submitLogout = async () => {
    try {
      setIsAuthActionPending(true);
      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch {

    } finally {
      await tokenStorage.removeRefreshToken();
      clearSession();
      setIsAuthActionPending(false);
    }
  };

  const submitDeleteAccount = async () => {
    try {
      setIsAuthActionPending(true);
      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('Missing refresh token');
      }

      await authApi.deleteAccount({ refreshToken });
      await tokenStorage.removeRefreshToken();
      clearSession();
    } catch {
      Alert.alert('회원탈퇴 실패', '잠시 후 다시 시도해주세요.');
    } finally {
      setIsAuthActionPending(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 110 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>내 정보</Text>

      <ProfileHeader
        nickname={nickname}
        joinedDayCount={joinedDayCount}
        isLoading={isHeaderLoading}
      />

      <ProfileSummaryCard
        totalRecordCount={stats?.totalRecordCount ?? null}
        totalPlaceCount={stats?.totalPlaceCount ?? null}
        isLoading={isSummaryLoading}
      />

      {(userQuery.isError || overviewQuery.isError) && (
        <Text style={styles.errorText}>
          일부 정보를 불러오지 못했어요. 잠시 후 다시 확인해주세요.
        </Text>
      )}

      <ProfileMenuList
        onPressPrivacy={() => {
          void openExternalUrl(PRIVACY_POLICY_URL);
        }}
        onPressTerms={() => {
          void openExternalUrl(TERMS_OF_SERVICE_URL);
        }}
        onPressContact={() => showPreparingAlert('문의하기')}
        onPressHelp={() => showPreparingAlert('도움말')}
        onPressLogout={handleLogout}
        onPressDeleteAccount={handleDeleteAccount}
        isAuthActionPending={isAuthActionPending}
      />

      <ProfileConfirmModal
        visible={confirmModalType !== null}
        type={confirmModalType ?? 'logout'}
        isPending={isAuthActionPending}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAuthAction}
      />
    </ScrollView>
  );
}

function calculateJoinedDayCount(createdAt: string) {
  const joinedDate = new Date(createdAt);
  const now = new Date();
  const joinedStart = new Date(
    joinedDate.getFullYear(),
    joinedDate.getMonth(),
    joinedDate.getDate(),
  );
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = todayStart.getTime() - joinedStart.getTime();
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(diffDay + 1, 1);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
  },
  title: {
    color: '#5E4B9A',
    fontSize: 30,
    fontWeight: '700',
    paddingHorizontal: 24,
    paddingTop: 64,
    lineHeight: 38,
  },
  errorText: {
    color: semanticColor.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginHorizontal: 24,
    marginTop: 18,
  },
});
