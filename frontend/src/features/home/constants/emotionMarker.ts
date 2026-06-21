import { color } from '../../../shared/constants/color';

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'angry'
  | 'anxious'
  | 'calm'
  | 'flutter'
  | 'reflective'
  | 'tired';

export const emotionMarkerMeta = {
  happy: {
    image: require('../../../assets/emotions/happy.png'),
    color: '#F08BA8',
  },
  sad: {
    image: require('../../../assets/emotions/sad.png'),
    color: '#7EA4DF',
  },
  angry: {
    image: require('../../../assets/emotions/angry.png'),
    color: '#E85D75',
  },
  anxious: {
    image: require('../../../assets/emotions/anxious.png'),
    color: '#F5C451',
  },
  calm: {
    image: require('../../../assets/emotions/calm.png'),
    color: color.purple[500],
  },
  flutter: {
    image: require('../../../assets/emotions/flutter.png'),
    color: '#DE73A7',
  },
  reflective: {
    image: require('../../../assets/emotions/reflective.png'),
    color: '#68B987',
  },
  tired: {
    image: require('../../../assets/emotions/tired.png'),
    color: '#9A94AA',
  },
} as const;

