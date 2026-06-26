import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { MainStackParamList } from '../../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../../shared/constants/color';
import type { EmotionCode } from '../../../../shared/constants/emotionMeta';
import { useEmotionArchive } from '../../hooks/useArchiveEmotion';
import { EmotionArchiveItemCard } from './EmotionArchiveItemCard';

type ArchiveNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function EmotionArchiveContent() {
  const navigation = useNavigation<ArchiveNavigationProp>();
  const emotionArchiveQuery = useEmotionArchive();

  const handlePressEmotion = (emotion: EmotionCode) => {
    navigation.navigate('EmotionArchiveDetail', { emotion });
  };

  if (emotionArchiveQuery.isLoading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator color="#8E6CE5" size="small" />
        <Text style={styles.stateText}>감정별 보관함을 불러오는 중이에요.</Text>
      </View>
    );
  }

  if (emotionArchiveQuery.isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>감정별 보관함을 불러오지 못했어요.</Text>
        <Text style={styles.stateText}>잠시 후 다시 시도해주세요.</Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => emotionArchiveQuery.refetch()}
        >
          <Text style={styles.retryButtonText}>다시 불러오기</Text>
        </Pressable>
      </View>
    );
  }

  const emotions = emotionArchiveQuery.data?.emotions ?? [];

  return (
    <FlatList
      data={emotions}
      keyExtractor={(item) => item.emotion}
      renderItem={({ item }) => (
        <EmotionArchiveItemCard item={item} onPress={handlePressEmotion} />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>전체 기록 중</Text>
          <Text style={styles.headerTitle}>감정별 분포</Text>
          <Text style={styles.headerDescription}>
            기록된 순간 {emotionArchiveQuery.data?.totalRecordCount ?? 0}개
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>아직 감정 기록이 없어요.</Text>
          <Text style={styles.emptyDescription}>
            기록을 남기면 감정별로 차곡차곡 모아볼 수 있어요.
          </Text>
        </View>
      }
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 34,
  },
  emptyDescription: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  errorTitle: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 24,
    marginTop: 20,
    padding: 20,
  },
  headerDescription: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },
  headerEyebrow: {
    color: '#8E6CE5',
    fontSize: 13,
    fontWeight: '800',
  },
  headerTitle: {
    color: semanticColor.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
  },
  pressed: {
    opacity: 0.72,
  },
  retryButton: {
    backgroundColor: '#8E6CE5',
    borderRadius: 14,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  stateText: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
});
