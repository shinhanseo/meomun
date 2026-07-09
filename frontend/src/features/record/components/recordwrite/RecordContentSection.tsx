import { Feather } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';
import { type EmotionCode } from '../../../../shared/constants/emotionMeta';

interface RecordContentSectionProps {
  selectedEmotion: EmotionCode | null;
  content: string;
  onChangeContent: (content: string) => void;
}

const MAX_CONTENT_LENGTH = 300;

const emotionPlaceholderMap: Record<EmotionCode, string> = {
  ANGRY: `오늘 무슨 일이 있었나요?`,
  ANXIOUS: `무엇이 당신을 초조하게 하나요?`,
  CALM: `무엇이 마음을 가라앉혀줬나요?`,
  FLUTTER: `무엇이 당신을 두근거리게 했나요?`,
  HAPPY: `어떤 순간이 좋았나요?`,
  REFLECTIVE: `무슨 생각을 했나요?`,
  SAD: `어떤 일이 나를 울적하게 했나요?`,
  TIRED: `무엇이 나를 지치게 했나요?`,
};

export function RecordContentSection({
  selectedEmotion,
  content,
  onChangeContent,
}: RecordContentSectionProps) {
  const placeholderText = selectedEmotion ? emotionPlaceholderMap[selectedEmotion] : '오늘, 이 장소에서 느낀 감정을\n자유롭게 적어보세요.';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather color="#9B8BC0" size={22} strokeWidth={2} />
          <Text style={styles.label}>기록</Text>
        </View>

        <Text style={styles.helper}>길게 쓰지 않아도 괜찮아요</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          placeholder={placeholderText}
          placeholderTextColor="#A8A1B8"
          style={styles.input}
          multiline
          maxLength={MAX_CONTENT_LENGTH}
          textAlignVertical="top"
          onChangeText={onChangeContent}
        />

        <Text style={styles.count}>
          {content.length}/{MAX_CONTENT_LENGTH}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  helper: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
    borderColor: '#ECE7F3',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 150,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 34,
    position: 'relative',
  },
  input: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    minHeight: 96,
    padding: 0,
  },
  count: {
    bottom: 14,
    color: '#A8A1B8',
    fontSize: 13,
    fontWeight: '600',
    position: 'absolute',
    right: 18,
  },
});
