import type { ImageSourcePropType } from 'react-native';

import angryIcon from '../../assets/emotions/angry.png';
import anxiousIcon from '../../assets/emotions/anxious.png';
import calmIcon from '../../assets/emotions/calm.png';
import flutterIcon from '../../assets/emotions/flutter.png';
import happyIcon from '../../assets/emotions/happy.png';
import reflectiveIcon from '../../assets/emotions/reflective.png';
import sadIcon from '../../assets/emotions/sad.png';
import tiredIcon from '../../assets/emotions/tired.png';
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
    icon: angryIcon,
    color: color.red[500],
  },
  ANXIOUS: {
    label: '불안',
    icon: anxiousIcon,
    color: '#B58AF7',
  },
  CALM: {
    label: '평온',
    icon: calmIcon,
    color: color.green[500],
  },
  FLUTTER: {
    label: '설렘',
    icon: flutterIcon,
    color: color.pink[500],
  },
  HAPPY: {
    label: '행복',
    icon: happyIcon,
    color: color.yellow[500],
  },
  REFLECTIVE: {
    label: '사색',
    icon: reflectiveIcon,
    color: '#7C6FD6',
  },
  SAD: {
    label: '슬픔',
    icon: sadIcon,
    color: color.blue[500],
  },
  TIRED: {
    label: '지침',
    icon: tiredIcon,
    color: color.gray[400],
  },
} satisfies Record<EmotionCode, EmotionMeta>;
