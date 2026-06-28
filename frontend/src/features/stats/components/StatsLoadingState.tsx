import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';

interface StatsLoadingStateProps {
  message?: string;
}

export function StatsLoadingState({
  message = '통계를 불러오는 중이에요.',
}: StatsLoadingStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.indicatorBox}>
        <ActivityIndicator color="#8E6CE5" size="small" />
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: 'rgba(236, 231, 243, 0.9)',
    borderRadius: 22,
    borderWidth: 1,
    marginHorizontal: 24,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  indicatorBox: {
    alignItems: 'center',
    backgroundColor: '#F4EEFF',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  message: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 14,
  },
});
