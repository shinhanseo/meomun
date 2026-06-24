import type { ImageSourcePropType } from 'react-native';

import { color } from './color';

export const EMOTION_CODES = [
  'ANGRY',
  'ANXIOUS',
  'CALM',
  'FLUTTER',
  'HAPPY',
  'REFLECTIVE',
  'SAD',
  'TIRED',
] as const;

export type EmotionCode = (typeof EMOTION_CODES)[number];

type EmotionMeta = {
  label: string;
  icon: ImageSourcePropType;
  color: string;
};

export const emotionMeta = {
  ANGRY: {
    label: '화남',
    icon: require('../../assets/emotions/angry.png'),
    color: color.red[500],
  },
  ANXIOUS: {
    label: '불안',
    icon: require('../../assets/emotions/anxious.png'),
    color: '#B58AF7',
  },
  CALM: {
    label: '평온',
    icon: require('../../assets/emotions/calm.png'),
    color: color.green[500],
  },
  FLUTTER: {
    label: '설렘',
    icon: require('../../assets/emotions/flutter.png'),
    color: color.pink[500],
  },
  HAPPY: {
    label: '행복',
    icon: require('../../assets/emotions/happy.png'),
    color: color.yellow[500],
  },
  REFLECTIVE: {
    label: '사색',
    icon: require('../../assets/emotions/reflective.png'),
    color: '#7C6FD6',
  },
  SAD: {
    label: '슬픔',
    icon: require('../../assets/emotions/sad.png'),
    color: color.blue[500],
  },
  TIRED: {
    label: '지침',
    icon: require('../../assets/emotions/tired.png'),
    color: color.gray[400],
  },
} satisfies Record<EmotionCode, EmotionMeta>;
