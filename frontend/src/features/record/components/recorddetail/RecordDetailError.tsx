import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { color, semanticColor } from '../../../../shared/constants/color';

export function RecordDetailError({
  isFetching,
  onRetry,
  onBack,
}: {
  isFetching: boolean;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>기록을 불러오지 못했어요.</Text>
      <Text style={styles.errorDescription}>
        네트워크 상태를 확인한 뒤 다시 시도해주세요.
      </Text>

      <Pressable
        style={[
          styles.retryButton,
          isFetching && styles.retryButtonDisabled,
        ]}
        onPress={onRetry}
        disabled={isFetching}
      >
        <Text style={styles.retryButtonText}>
          {isFetching ? '다시 불러오는 중...' : '다시 시도'}
        </Text>
      </Pressable>

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>돌아가기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColor.background,
    paddingHorizontal: 32,
  },
  emptyContent: {
    marginTop: 24,
    fontSize: 15,
    lineHeight: 22,
    color: semanticColor.textMuted,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticColor.textPrimary,
  },
  errorDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: semanticColor.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    height: 48,
    minWidth: 140,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticColor.primary,
    paddingHorizontal: 22,
  },
  retryButtonDisabled: {
    opacity: 0.65,
  },
  retryButtonText: {
    color: color.white,
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});