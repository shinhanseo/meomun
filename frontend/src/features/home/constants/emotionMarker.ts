import { color } from '../../../shared/constants/color';

export const emotionMarkerMeta = {
  HAPPY: {
    image: require('../../../assets/emotions/happy.png'),
    color: '#F08BA8',
  },
  SAD: {
    image: require('../../../assets/emotions/sad.png'),
    color: '#7EA4DF',
  },
  ANGRY: {
    image: require('../../../assets/emotions/angry.png'),
    color: '#E85D75',
  },
  ANXIOUS: {
    image: require('../../../assets/emotions/anxious.png'),
    color: '#F5C451',
  },
  CALM: {
    image: require('../../../assets/emotions/calm.png'),
    color: color.purple[500],
  },
  FLUTTER: {
    image: require('../../../assets/emotions/flutter.png'),
    color: '#DE73A7',
  },
  REFLECTIVE: {
    image: require('../../../assets/emotions/reflective.png'),
    color: '#68B987',
  },
  TIRED: {
    image: require('../../../assets/emotions/tired.png'),
    color: '#9A94AA',
  },
} as const;

export type EmotionType = keyof typeof emotionMarkerMeta;