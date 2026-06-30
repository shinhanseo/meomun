import { Emotion } from '../../generated/prisma/enums.js';
import type { Emotion as EmotionValue } from '../../generated/prisma/enums.js';

export const EMOTION_ORDER: EmotionValue[] = [
  Emotion.ANGRY,
  Emotion.ANXIOUS,
  Emotion.CALM,
  Emotion.FLUTTER,
  Emotion.HAPPY,
  Emotion.REFLECTIVE,
  Emotion.SAD,
  Emotion.TIRED,
];

const emotionOrderRank = new Map(
  EMOTION_ORDER.map((emotion, index) => [emotion, index]),
);

export function compareEmotionByOrder(
  emotionA: EmotionValue,
  emotionB: EmotionValue,
): number {
  return (
    (emotionOrderRank.get(emotionA) ?? Number.MAX_SAFE_INTEGER) -
    (emotionOrderRank.get(emotionB) ?? Number.MAX_SAFE_INTEGER)
  );
}

export function compareEmotionStats(
  statA: { emotion: EmotionValue; recordCount: number },
  statB: { emotion: EmotionValue; recordCount: number },
): number {
  if (statA.recordCount !== statB.recordCount) {
    return statB.recordCount - statA.recordCount;
  }

  return compareEmotionByOrder(statA.emotion, statB.emotion);
}
