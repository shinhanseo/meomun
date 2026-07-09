import markerAngry from '../../../assets/markers/marker_ANGRY.png';
import markerAnxious from '../../../assets/markers/marker_ANXIOUS.png';
import markerCalm from '../../../assets/markers/marker_CALM.png';
import markerFlutter from '../../../assets/markers/marker_FLUTTER.png';
import markerHappy from '../../../assets/markers/marker_HAPPY.png';
import markerReflective from '../../../assets/markers/marker_REFLECTIVE.png';
import markerSad from '../../../assets/markers/marker_SAD.png';
import markerTired from '../../../assets/markers/marker_TIRED.png';

export const emotionMarkerMeta = {
  HAPPY: {
    label: '기쁨',
    image: markerHappy,
    color: '#FEC922',
  },
  SAD: {
    label: '슬픔',
    image: markerSad,
    color: '#7EA4DF',
  },
  ANGRY: {
    label: '화남',
    image: markerAngry,
    color: '#E85D75',
  },
  ANXIOUS: {
    label: '불안',
    image: markerAnxious,
    color: '#F08BA8',
  },
  CALM: {
    label: '평온',
    image: markerCalm,
    color: '#83CC87',
  },
  FLUTTER: {
    label: '설렘',
    image: markerFlutter,
    color: '#DE73A7',
  },
  REFLECTIVE: {
    label: '사색',
    image: markerReflective,
    color: '#C7B9F8',
  },
  TIRED: {
    label: '지침',
    image: markerTired,
    color: '#9A94AA',
  },
} as const;

export type EmotionType = keyof typeof emotionMarkerMeta;
