import { X } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';

interface RecordWriteHeaderProps {
  isSaving: boolean;
  onPressClose: () => void;
  onPressSave: () => void;
}

export function RecordWriteHeader({
  isSaving,
  onPressClose,
  onPressSave,
}: RecordWriteHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        hitSlop={12}
        style={styles.closeButton}
        onPress={onPressClose}
      >
        <X color={semanticColor.textSecondary} size={28} strokeWidth={2} />
      </Pressable>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>감정 남기기</Text>
        <Text style={styles.subtitle}>이 장소에 어떤 감정이 남았나요?</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isSaving}
        style={({ pressed }) => [
          styles.saveButton,
          pressed && !isSaving && styles.saveButtonPressed,
          isSaving && styles.saveButtonDisabled,
        ]}
        onPress={onPressSave}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>저장</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
  },
  closeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: semanticColor.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    marginTop: 6,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#A88BE8',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    minWidth: 72,
    paddingHorizontal: 18,
    shadowColor: '#A88BE8',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});