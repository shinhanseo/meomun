import { AlertCircleIcon } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../../shared/constants/color';

interface RecordWriteValidationModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export function RecordWriteValidationModal({
  visible,
  message,
  onClose,
}: RecordWriteValidationModalProps) {
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
            <AlertCircleIcon
              color={semanticColor.primary}
              size={30}
              strokeWidth={2.2}
            />
          </View>

          <Text style={styles.title}>아직 비어있는 곳이 있어요</Text>
          <Text style={styles.description}>{message}</Text>

          <Pressable style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmText}>확인</Text>
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
    textAlign: 'center',
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    marginTop: 9,
    textAlign: 'center',
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: semanticColor.primary,
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginTop: 26,
    width: '100%',
  },
  confirmText: {
    color: color.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
