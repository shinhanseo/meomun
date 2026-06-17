import { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { color, semanticColor } from '../../../shared/constants/color';

import { useOnboardingStore } from '../store/onboardingStore';

const slides = [
  {
    id: 'map',
    title: '오늘의 감정을\n지도 위에 남겨보세요',
    description: '내가 머문 장소와 감정을\n하나의 지도에 기록해요.',
    image: require('../../../assets/images/onboarding/onborading1.png'),
  },
  {
    id: 'record',
    title: '소중한 순간들을\n기록하고 돌아보세요',
    description: '사진과 함께 남긴 기록이\n나만의 감정 지도가 되어줄 거예요.',
    image: require('../../../assets/images/onboarding/onboarding2.png'),
  },
  {
    id: 'stats',
    title: '나만의 감정 흐름을\n한눈에 확인하세요',
    description: '통계를 통해 내 감정의 패턴을\n발견하고 이해할 수 있어요.',
    image: require('../../../assets/images/onboarding/onborading3.png'),
  },
];

export function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );

    setCurrentIndex(nextIndex);
  };

  const handlePressNext = async () => {
    if (isLastSlide) {
      await completeOnboarding();
      // navigation.replace('Login');
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.textArea}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>

            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      />

      <View style={styles.bottomArea}>
        <View style={styles.dots}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Pressable style={styles.button} onPress={handlePressNext}>
          <Text style={styles.buttonText}>
            {isLastSlide ? '시작하기' : '다음'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 150,
  },
  textArea: {
    alignItems: 'center',
  },
  title: {
    color: semanticColor.primary,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 48,
    textAlign: 'center',
  },
  description: {
    color: semanticColor.textSecondary,
    fontSize: 20,
    lineHeight: 32,
    marginTop: 28,
    textAlign: 'center',
  },
  image: {
    height: 430,
    marginTop: 48,
    width: '100%',
  },
  bottomArea: {
    alignItems: 'center',
    bottom: 48,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  dots: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  dot: {
    backgroundColor: color.gray[300],
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  activeDot: {
    backgroundColor: semanticColor.primary,
  },
  button: {
    alignItems: 'center',
    backgroundColor: semanticColor.primary,
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 180,
  },
  buttonText: {
    color: color.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
