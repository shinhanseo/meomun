import { AlertTriangleIcon, LogOutIcon, UserMinusIcon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

type ProfileConfirmModalType = 'logout' | 'deleteAccount';

interface ProfileConfirmModalProps {
  visible: boolean;
  type: ProfileConfirmModalType;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const modalContent = {
  logout: {
    title: '로그아웃할까요?',
    description: '다시 이용하려면 로그인 화면에서 계정으로 접속하면 돼요.',
    confirmLabel: '로그아웃',
  },
  deleteAccount: {
    title: '정말 탈퇴할까요?',
    description: '계정과 기록이 삭제될 수 있어요. 이 작업은 신중하게 진행해주세요.',
    confirmLabel: '탈퇴하기',
  },
} satisfies Record<
  ProfileConfirmModalType,
  {
    title: string;
    description: string;
    confirmLabel: string;
  }
>;

export function ProfileConfirmModal({
  visible,
  type,
  isPending,
  onClose,
  onConfirm,
}: ProfileConfirmModalProps) {
  const content = modalContent[type];
  const isDeleteAccount = type === 'deleteAccount';
  const icon = isDeleteAccount ? (
    <UserMinusIcon color={semanticColor.danger} size={28} strokeWidth={2.2} />
  ) : (
    <LogOutIcon color={semanticColor.primary} size={28} strokeWidth={2.2} />
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          disabled={isPending}
          onPress={onClose}
        />

        <View style={styles.dialog}>
          <View
            style={[
              styles.iconCircle,
              isDeleteAccount ? styles.dangerIconCircle : styles.primaryIconCircle,
            ]}
          >
            {icon}
          </View>

          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.description}>{content.description}</Text>

          {isDeleteAccount ? (
            <View style={styles.warningBox}>
              <AlertTriangleIcon
                color={semanticColor.danger}
                size={17}
                strokeWidth={2.2}
              />
              <Text style={styles.warningText}>
                탈퇴 후에는 같은 계정의 기록 복구가 어려울 수 있어요.
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              disabled={isPending}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                isDeleteAccount ? styles.dangerButton : styles.primaryButton,
              ]}
              disabled={isPending}
              onPress={onConfirm}
            >
              {isPending ? (
                <ActivityIndicator color={color.white} />
              ) : (
                <Text style={styles.confirmText}>{content.confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(21, 19, 26, 0.42)',
  },
  dialog: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 28,
    elevation: 18,
    paddingBottom: 22,
    paddingHorizontal: 22,
    paddingTop: 28,
    shadowColor: color.purple[900],
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    width: '100%',
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 31,
    height: 62,
    justifyContent: 'center',
    marginBottom: 18,
    width: 62,
  },
  primaryIconCircle: {
    backgroundColor: semanticColor.primarySoft,
  },
  dangerIconCircle: {
    backgroundColor: semanticColor.dangerSoft,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 9,
    textAlign: 'center',
  },
  warningBox: {
    alignItems: 'flex-start',
    backgroundColor: semanticColor.dangerSoft,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  warningText: {
    color: color.red[700],
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
    width: '100%',
  },
  button: {
    alignItems: 'center',
    borderRadius: 26,
    flex: 1,
    height: 52,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: color.gray[100],
  },
  primaryButton: {
    backgroundColor: semanticColor.primary,
  },
  dangerButton: {
    backgroundColor: semanticColor.danger,
  },
  cancelText: {
    color: color.gray[600],
    fontSize: 15,
    fontWeight: '800',
  },
  confirmText: {
    color: color.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
