import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MainStackParamList } from '../../../../app/navigation/MainStackNavigator';
import { semanticColor } from '../../../../shared/constants/color';
import {
  emotionMeta,
  type EmotionCode,
} from '../../../../shared/constants/emotionMeta';
import { useEmotionArchive } from '../../hooks/useArchiveEmotion';
import { ArchiveSkeleton } from '../shared/ArchiveSkeleton';
import { EmotionArchiveItemCard } from './EmotionArchiveItemCard';

type ArchiveNavigationProp = NativeStackNavigationProp<MainStackParamList>;

export function EmotionArchiveContent() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ArchiveNavigationProp>();
  const emotionArchiveQuery = useEmotionArchive();

  const handlePressEmotion = (emotion: EmotionCode) => {
    navigation.navigate('EmotionArchiveDetail', { emotion });
  };

  if (emotionArchiveQuery.isLoading) {
    return <ArchiveSkeleton variant="emotion" />;
  }

  if (emotionArchiveQuery.isError) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.errorTitle}>
          감정별 보관함을 불러오지 못했어요.
        </Text>
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
  const topEmotions = emotions.slice(0, 4);

  return (
    <FlatList
      data={emotions}
      keyExtractor={(item) => item.emotion}
      renderItem={({ item }) => (
        <EmotionArchiveItemCard item={item} onPress={handlePressEmotion} />
      )}
      ListHeaderComponent={
        <>
          <LinearGradient
            colors={['#7E6BDA', '#B99AF4', '#F1C7DC']}
            locations={[0, 0.58, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryGlow} />

            <View style={styles.summaryTextArea}>
              <Text style={styles.summaryEyebrow}>전체 기록 중</Text>
              <Text style={styles.summaryTitle}>감정별 분포</Text>
              <Text style={styles.summaryDescription}>
                기록된 순간 {emotionArchiveQuery.data?.totalRecordCount ?? 0}개
              </Text>
            </View>

            <View style={styles.emotionCluster}>
              {topEmotions.map((item, index) => {
                const meta = emotionMeta[item.emotion];

                return (
                  <View
                    key={item.emotion}
                    style={[
                      styles.clusterIconCircle,
                      {
                        backgroundColor: `${meta.color}30`,
                        left: index % 2 === 0 ? 8 : 58,
                        top: index < 2 ? 10 : 64,
                      },
                    ]}
                  >
                    <Image source={meta.icon} style={styles.clusterIcon} />
                  </View>
                );
              })}

              <View style={styles.clusterCenter}>
                <Text style={styles.clusterCenterText}>감정</Text>
              </View>
            </View>
          </LinearGradient>

          <Text style={styles.listTitle}>감정 모아보기</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>아직 감정 기록이 없어요.</Text>
          <Text style={styles.emptyDescription}>
            기록을 남기면 감정별로 차곡차곡 모아볼 수 있어요.
          </Text>
        </View>
      }
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 110 },
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 110,
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
  clusterCenter: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 999,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    left: 34,
    position: 'absolute',
    top: 38,
    width: 58,
  },
  clusterCenterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  clusterIcon: {
    height: 28,
    resizeMode: 'contain',
    width: 28,
  },
  clusterIconCircle: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.42)',
    borderRadius: 999,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    position: 'absolute',
    width: 52,
  },
  emotionCluster: {
    height: 132,
    position: 'relative',
    width: 128,
  },
  listTitle: {
    color: '#5E4B9A',
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 24,
    marginTop: 22,
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
  summaryCard: {
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 20,
    minHeight: 178,
    overflow: 'hidden',
    padding: 22,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  summaryDescription: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
  },
  summaryEyebrow: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 13,
    fontWeight: '800',
  },
  summaryGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 999,
    height: 150,
    position: 'absolute',
    right: -48,
    top: -52,
    width: 150,
  },
  summaryTextArea: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 16,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
});
