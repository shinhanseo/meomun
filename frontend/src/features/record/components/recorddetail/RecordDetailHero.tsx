import {
  Image,
  ImageBackground,
  type ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronLeftIcon, MapPinIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color } from '../../../../shared/constants/color';
import {
  emotionMeta,
  type EmotionCode,
} from '../../../../shared/constants/emotionMeta';

type RecordDetailHeroProps = {
  title: string;
  recordedAt: string;
  placeName: string;
  address: string;
  emotion: EmotionCode;
  imageUrl?: string;
  onBack: () => void;
};

export function RecordDetailHero({
  title,
  recordedAt,
  placeName,
  address,
  emotion,
  imageUrl,
  onBack,
}: RecordDetailHeroProps) {
  const insets = useSafeAreaInsets();
  const emotionInfo = emotionMeta[emotion];

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <ImageBackground
          source={{ uri: imageUrl }}
          style={styles.image}
          imageStyle={styles.imageInner}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <HeroContent
            topInset={insets.top}
            title={title}
            recordedAt={recordedAt}
            placeName={placeName}
            address={address}
            emotionLabel={emotionInfo.label}
            emotionColor={emotionInfo.color}
            emotionIcon={emotionInfo.icon}
            onBack={onBack}
          />
        </ImageBackground>
      ) : (
        <View style={styles.fallback}>
          <View style={styles.overlay} />
          <HeroContent
            topInset={insets.top}
            title={title}
            recordedAt={recordedAt}
            placeName={placeName}
            address={address}
            emotionLabel={emotionInfo.label}
            emotionColor={emotionInfo.color}
            emotionIcon={emotionInfo.icon}
            onBack={onBack}
          />
        </View>
      )}
    </View>
  );
}

type HeroContentProps = {
  topInset: number;
  title: string;
  recordedAt: string;
  placeName: string;
  address: string;
  emotionLabel: string;
  emotionColor: string;
  emotionIcon: ImageSourcePropType;
  onBack: () => void;
};

function HeroContent({
  topInset,
  title,
  recordedAt,
  placeName,
  address,
  emotionLabel,
  emotionColor,
  emotionIcon,
  onBack,
}: HeroContentProps) {
  return (
    <>
      <View style={[styles.topBar, { paddingTop: topInset + 10 }]}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <ChevronLeftIcon size={24} color={color.purple[800]} />
        </Pressable>
      </View>

      <View style={styles.info}>
        <Text style={styles.date}>{formatDate(recordedAt)}</Text>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.placeRow}>
          <MapPinIcon size={15} color="rgba(255, 255, 255, 0.9)" />
          <Text style={styles.place} numberOfLines={1}>
            {address || placeName}
          </Text>
        </View>
      </View>

      <View style={[styles.emotionBadge, { borderColor: `${emotionColor}80` }]}>
        <Image source={emotionIcon} style={styles.emotionIcon} />
        <Text style={styles.emotionText}>{emotionLabel}</Text>
      </View>
    </>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(date.getDate()).padStart(2, '0')} (${weekdays[date.getDay()]})`;
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    overflow: 'hidden',
    width: '100%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  imageInner: {
    width: '100%',
  },
  fallback: {
    flex: 1,
    backgroundColor: color.purple[300],
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20, 16, 32, 0.28)',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  topBar: {
    left: 0,
    paddingHorizontal: 24,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 2,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  info: {
    bottom: 42,
    left: 24,
    position: 'absolute',
    right: 118,
    zIndex: 2,
  },
  date: {
    color: color.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    color: color.white,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
  },
  placeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 9,
  },
  place: {
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  emotionBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(247, 241, 255, 0.92)',
    borderRadius: 34,
    borderWidth: 2,
    bottom: 34,
    height: 58,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    width: 58,
    zIndex: 2,
  },
  emotionIcon: {
    height: 30,
    resizeMode: 'contain',
    width: 30,
  },
  emotionText: {
    color: color.purple[700],
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
