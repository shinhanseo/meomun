import { MailIcon } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

interface ProfileContactModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
}

export function ProfileContactModal({
  visible,
  email,
  onClose,
}: ProfileContactModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.dialog}>
          <View style={styles.iconCircle}>
            <MailIcon color={semanticColor.primary} size={28} strokeWidth={2.2} />
          </View>

          <Text style={styles.title}>메일 앱을 열 수 없어요</Text>
          <Text style={styles.description}>
            아래 이메일 주소로 문의 내용을 보내주세요.
          </Text>

          <View style={styles.emailBox}>
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              numberOfLines={1}
              style={styles.emailText}
            >
              {email}
            </Text>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>확인</Text>
          </Pressable>
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
    backgroundColor: semanticColor.primarySoft,
    borderRadius: 31,
    height: 62,
    justifyContent: 'center',
    marginBottom: 18,
    width: 62,
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
  emailBox: {
    alignItems: 'center',
    backgroundColor: color.purple[50],
    borderColor: color.purple[100],
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
  emailText: {
    color: semanticColor.primary,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: semanticColor.primary,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginTop: 24,
    width: '100%',
  },
  closeButtonText: {
    color: color.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
