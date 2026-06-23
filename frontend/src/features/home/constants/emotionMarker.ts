import { color } from '../../../shared/constants/color';

export const emotionMarkerMeta = {
  HAPPY: {
    label: '기쁨',
    image: require('../../../assets/markers/marker_HAPPY.png'),
    color: '#FEC922',
  },
  SAD: {
    label: '슬픔',
    image: require('../../../assets/markers/marker_SAD.png'),
    color: '#7EA4DF',
  },
  ANGRY: {
    label: '화남',
    image: require('../../../assets/markers/marker_ANGRY.png'),
    color: '#E85D75',
  },
  ANXIOUS: {
    label: '불안',
    image: require('../../../assets/markers/marker_ANXIOUS.png'),
    color: '#F08BA8',
  },
  CALM: {
    label: '평온',
    image: require('../../../assets/markers/marker_CALM.png'),
    color: '#83CC87',
  },
  FLUTTER: {
    label: '설렘',
    image: require('../../../assets/markers/marker_FLUTTER.png'),
    color: '#DE73A7',
  },
  REFLECTIVE: {
    label: '사색',
    image: require('../../../assets/markers/marker_REFLECTIVE.png'),
    color: '#C7B9F8',
  },
  TIRED: {
    label: '지침',
    image: require('../../../assets/markers/marker_TIRED.png'),
    color: '#9A94AA',
  },
} as const;

export type EmotionType = keyof typeof emotionMarkerMeta;
