import { Fragment, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  Animated,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { semanticColor } from '../../../../shared/constants/color';

type ArchiveSkeletonVariant = 'all' | 'monthly' | 'emotion';

interface ArchiveSkeletonProps {
  variant: ArchiveSkeletonVariant;
}

interface SkeletonBlockProps {
  animatedValue: Animated.Value;
  style?: StyleProp<ViewStyle>;
  width: number;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export function ArchiveSkeleton({ variant }: ArchiveSkeletonProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        duration: 1300,
        toValue: 1,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [shimmer]);

  const renderBlock = (style?: StyleProp<ViewStyle>) => (
    <SkeletonBlock animatedValue={shimmer} style={style} width={width} />
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + 110 },
      ]}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    >
      {variant === 'all' && renderAllSkeleton(renderBlock)}
      {variant === 'monthly' && renderMonthlySkeleton(renderBlock)}
      {variant === 'emotion' && renderEmotionSkeleton(renderBlock)}
    </ScrollView>
  );
}

function SkeletonBlock({ animatedValue, style, width }: SkeletonBlockProps) {
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, width + 120],
  });

  return (
    <View style={[styles.block, style]}>
      <AnimatedLinearGradient
        colors={[
          'rgba(255, 255, 255, 0)',
          'rgba(255, 255, 255, 0.62)',
          'rgba(255, 255, 255, 0)',
        ]}
        locations={[0, 0.48, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

function renderAllSkeleton(
  renderBlock: (style?: StyleProp<ViewStyle>) => ReactNode,
) {
  return (
    <>
      <LinearGradient
        colors={['#8A72DC', '#BCA2F0', '#F2CFE0']}
        locations={[0, 0.58, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.overviewCard}
      >
        <View style={styles.overviewTextArea}>
          {renderBlock(styles.lightEyebrow)}
          {renderBlock(styles.lightTotal)}
        </View>

        <View style={styles.summaryGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index} style={styles.summaryTile}>
              {renderBlock(styles.lightIcon)}
              {renderBlock(styles.lightLineShort)}
              {renderBlock(styles.lightLine)}
            </View>
          ))}
        </View>
      </LinearGradient>

      {renderBlock(styles.sectionTitle)}
      {Array.from({ length: 3 }).map((_, index) => (
        <RecordCardSkeleton key={index} renderBlock={renderBlock} />
      ))}
    </>
  );
}

function renderMonthlySkeleton(
  renderBlock: (style?: StyleProp<ViewStyle>) => ReactNode,
) {
  return (
    <>
      <LinearGradient
        colors={['#E8DDFF', '#F5E0ED', '#D4C6F8']}
        locations={[0, 0.56, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.monthlyCard}
      >
        {renderBlock(styles.monthPicker)}
        {renderBlock(styles.monthCount)}

        <View style={styles.monthlyBody}>
          <View style={styles.donutSkeleton}>
            {renderBlock(styles.donutInner)}
          </View>

          <View style={styles.monthEmotionGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={styles.monthEmotionItem}>
                {renderBlock(styles.monthEmotionIcon)}
                <View style={styles.monthEmotionText}>
                  {renderBlock(styles.monthEmotionLabel)}
                  {renderBlock(styles.monthEmotionValue)}
                </View>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {renderBlock(styles.sectionTitle)}
      {Array.from({ length: 3 }).map((_, index) => (
        <RecordCardSkeleton key={index} renderBlock={renderBlock} />
      ))}
    </>
  );
}

function renderEmotionSkeleton(
  renderBlock: (style?: StyleProp<ViewStyle>) => ReactNode,
) {
  return (
    <>
      <LinearGradient
        colors={['#806DDA', '#BCA0F1', '#F0CBE0']}
        locations={[0, 0.58, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emotionSummaryCard}
      >
        <View style={styles.emotionSummaryText}>
          {renderBlock(styles.lightEyebrowWide)}
          {renderBlock(styles.lightTitle)}
          {renderBlock(styles.lightDescription)}
        </View>

        <View style={styles.emotionClusterSkeleton}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Fragment key={index}>
              {renderBlock([
                styles.clusterDot,
                {
                  left: index % 2 === 0 ? 8 : 58,
                  top: index < 2 ? 10 : 64,
                },
              ])}
            </Fragment>
          ))}
          {renderBlock(styles.clusterCenter)}
        </View>
      </LinearGradient>

      {renderBlock(styles.sectionTitle)}
      {Array.from({ length: 5 }).map((_, index) => (
        <EmotionCardSkeleton key={index} renderBlock={renderBlock} />
      ))}
    </>
  );
}

function RecordCardSkeleton({
  renderBlock,
}: {
  renderBlock: (style?: StyleProp<ViewStyle>) => ReactNode;
}) {
  return (
    <View style={styles.recordCard}>
      {renderBlock(styles.recordThumbnail)}

      <View style={styles.recordContent}>
        {renderBlock(styles.recordDate)}
        {renderBlock(styles.recordTitle)}
        {renderBlock(styles.recordDescription)}
        {renderBlock(styles.recordDescriptionShort)}

        <View style={styles.badgeRow}>
          {renderBlock(styles.badge)}
          {renderBlock(styles.placeLine)}
        </View>
      </View>
    </View>
  );
}

function EmotionCardSkeleton({
  renderBlock,
}: {
  renderBlock: (style?: StyleProp<ViewStyle>) => ReactNode;
}) {
  return (
    <View style={styles.emotionCard}>
      {renderBlock(styles.emotionIconShell)}

      <View style={styles.emotionCardContent}>
        <View style={styles.emotionCardHeader}>
          {renderBlock(styles.emotionName)}
          {renderBlock(styles.emotionPercent)}
        </View>
        {renderBlock(styles.emotionDescription)}
        {renderBlock(styles.progressTrack)}
        {renderBlock(styles.emotionCount)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 24,
    width: 74,
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  block: {
    backgroundColor: '#ECE6F4',
    borderRadius: 999,
    overflow: 'hidden',
  },
  clusterCenter: {
    height: 58,
    left: 34,
    position: 'absolute',
    top: 38,
    width: 58,
  },
  clusterDot: {
    height: 52,
    position: 'absolute',
    width: 52,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  donutInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.48)',
    height: 96,
    width: 96,
  },
  donutSkeleton: {
    alignItems: 'center',
    borderColor: 'rgba(142, 108, 229, 0.22)',
    borderRadius: 999,
    borderWidth: 14,
    height: 128,
    justifyContent: 'center',
    width: 128,
  },
  emotionCard: {
    alignItems: 'center',
    backgroundColor: semanticColor.surface,
    borderColor: 'rgba(142, 108, 229, 0.06)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 12,
    padding: 14,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  emotionCardContent: {
    flex: 1,
    gap: 9,
    marginLeft: 14,
    minWidth: 0,
  },
  emotionCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emotionClusterSkeleton: {
    height: 132,
    position: 'relative',
    width: 128,
  },
  emotionCount: {
    height: 13,
    width: 72,
  },
  emotionDescription: {
    height: 13,
    width: '78%',
  },
  emotionIconShell: {
    borderRadius: 22,
    height: 74,
    width: 74,
  },
  emotionName: {
    height: 18,
    width: 84,
  },
  emotionPercent: {
    height: 18,
    width: 42,
  },
  emotionSummaryCard: {
    alignItems: 'center',
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 28,
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
  emotionSummaryText: {
    flex: 1,
    gap: 12,
  },
  lightDescription: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    height: 14,
    width: '72%',
  },
  lightEyebrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    height: 14,
    width: 56,
  },
  lightEyebrowWide: {
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    height: 14,
    width: 86,
  },
  lightIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
    height: 24,
    width: 24,
  },
  lightLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    height: 14,
    width: '80%',
  },
  lightLineShort: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    height: 10,
    width: '58%',
  },
  lightTitle: {
    backgroundColor: 'rgba(255, 255, 255, 0.54)',
    height: 26,
    width: 124,
  },
  lightTotal: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 42,
    width: 96,
  },
  monthCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
    height: 14,
    marginTop: 13,
    width: 108,
  },
  monthEmotionGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  monthEmotionIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.46)',
    height: 33,
    width: 33,
  },
  monthEmotionItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    width: '50%',
  },
  monthEmotionLabel: {
    height: 12,
    width: 42,
  },
  monthEmotionText: {
    gap: 7,
  },
  monthEmotionValue: {
    height: 18,
    width: 28,
  },
  monthPicker: {
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    height: 26,
    width: 138,
  },
  monthlyBody: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
  },
  monthlyCard: {
    borderRadius: 22,
    marginHorizontal: 24,
    marginTop: 20,
    minHeight: 260,
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
  overviewCard: {
    borderRadius: 22,
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 24,
    marginTop: 30,
    minHeight: 188,
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
  },
  overviewTextArea: {
    flex: 0.46,
    gap: 12,
    justifyContent: 'center',
  },
  placeLine: {
    flex: 1,
    height: 14,
  },
  progressTrack: {
    height: 8,
    width: '100%',
  },
  recordCard: {
    backgroundColor: semanticColor.surface,
    borderRadius: 18,
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 12,
    minHeight: 132,
    padding: 10,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
  },
  recordContent: {
    flex: 1,
    minWidth: 0,
    paddingBottom: 4,
    paddingLeft: 14,
    paddingRight: 28,
    paddingTop: 8,
  },
  recordDate: {
    height: 13,
    marginBottom: 10,
    width: '68%',
  },
  recordDescription: {
    height: 13,
    marginBottom: 8,
    width: '100%',
  },
  recordDescriptionShort: {
    height: 13,
    width: '76%',
  },
  recordThumbnail: {
    borderRadius: 14,
    height: 112,
    width: 112,
  },
  recordTitle: {
    height: 18,
    marginBottom: 12,
    width: '58%',
  },
  sectionTitle: {
    height: 18,
    marginHorizontal: 24,
    marginTop: 22,
    width: 88,
  },
  shimmer: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 92,
  },
  summaryGrid: {
    flex: 1.2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  summaryTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
    minHeight: 70,
    paddingHorizontal: 9,
    paddingVertical: 9,
    width: '48%',
  },
});
