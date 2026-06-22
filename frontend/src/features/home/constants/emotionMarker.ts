import { color } from '../../../shared/constants/color';

export const emotionMarkerMeta = {
  HAPPY: {
    image: require('../../../assets/markers/marker_HAPPY.png'),
    color: '#F08BA8',
  },
  SAD: {
    image: require('../../../assets/markers/marker_SAD.png'),
    color: '#7EA4DF',
  },
  ANGRY: {
    image: require('../../../assets/markers/marker_ANGRY.png'),
    color: '#E85D75',
  },
  ANXIOUS: {
    image: require('../../../assets/markers/marker_ANXIOUS.png'),
    color: '#F5C451',
  },
  CALM: {
    image: require('../../../assets/markers/marker_CALM.png'),
    color: color.purple[500],
  },
  FLUTTER: {
    image: require('../../../assets/markers/marker_FLUTTER.png'),
    color: '#DE73A7',
  },
  REFLECTIVE: {
    image: require('../../../assets/markers/marker_REFLECTIVE.png'),
    color: '#68B987',
  },
  TIRED: {
    image: require('../../../assets/markers/marker_TIRED.png'),
    color: '#9A94AA',
  },
} as const;

export type EmotionType = keyof typeof emotionMarkerMeta;
