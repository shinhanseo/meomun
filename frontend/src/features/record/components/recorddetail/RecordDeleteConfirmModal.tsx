import { AlertTriangleIcon, Trash2Icon } from 'lucide-react-native';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { color, semanticColor } from '../../../../shared/constants/color';

type RecordDeleteConfirmModalProps = {
  visible: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function RecordDeleteConfirmModal({
  visible,
  isDeleting,
  onClose,
  onConfirm,
}: RecordDeleteConfirmModalProps) {
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
          disabled={isDeleting}
          onPress={onClose}
        />

        <View style={styles.dialog}>
          <View style={styles.iconCircle}>
            <AlertTriangleIcon
              size={28}
              color={semanticColor.danger}
              strokeWidth={2.2}
            />
          </View>

          <Text style={styles.title}>기록을 삭제할까요?</Text>
          <Text style={styles.description}>
            삭제한 기록과 사진은 다시 되돌릴 수 없어요.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              disabled={isDeleting}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.deleteButton]}
              disabled={isDeleting}
              onPress={onConfirm}
            >
              {isDeleting ? (
                <ActivityIndicator color={color.white} />
              ) : (
                <>
                  <Trash2Icon size={18} color={color.white} strokeWidth={2} />
                  <Text style={styles.deleteText}>삭제</Text>
                </>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(21, 19, 26, 0.42)',
  },
  dialog: {
    width: '100%',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: color.purple[900],
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 18,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColor.dangerSoft,
    marginBottom: 18,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    marginTop: 9,
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 26,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  cancelButton: {
    backgroundColor: color.gray[100],
  },
  deleteButton: {
    backgroundColor: semanticColor.danger,
  },
  cancelText: {
    color: color.gray[600],
    fontSize: 15,
    fontWeight: '800',
  },
  deleteText: {
    color: color.white,
    fontSize: 15,
    fontWeight: '800',
  },
});
