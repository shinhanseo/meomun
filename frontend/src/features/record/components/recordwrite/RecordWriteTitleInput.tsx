import { Feather } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';

interface RecordTitleInputProps {
  title: string;
  onChangeTitle: (title: string) => void;
}

export function RecordWrtieTitleInput({
  title,
  onChangeTitle,
}: RecordTitleInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather color="#9B8BC0" size={22} strokeWidth={2} />
          <Text style={styles.label}>제목</Text>
        </View>

        <Text style={styles.helper}>편하게 적어도 괜찮아요</Text>
      </View>

      <TextInput
        value={title}
        placeholder="오늘의 감정을 한 줄로 남겨보세요."
        placeholderTextColor="#A8A1B8"
        style={styles.input}
        maxLength={20}
        returnKeyType="done"
        onChangeText={onChangeTitle}
      />ㅇ

      <Text style={styles.count}>{title.length}/20</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 24,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 18,
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
  input: {
    borderColor: '#ECE7F3',
    borderRadius: 16,
    borderWidth: 1,
    color: semanticColor.textPrimary,
    fontSize: 17,
    fontWeight: '600',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  count: {
    alignSelf: 'flex-end',
    color: '#A8A1B8',
    fontSize: 12,
    marginTop: 8,
  },
});