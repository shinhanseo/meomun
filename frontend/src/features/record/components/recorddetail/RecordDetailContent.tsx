import { StyleSheet, Text, View } from 'react-native';

import { color, semanticColor } from '../../../../shared/constants/color';

type RecordDetailContentProps = {
  content: string | null;
};

export function RecordDetailContent({ content }: RecordDetailContentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.quote}>“</Text>

      {content ? (
        <Text style={styles.content}>{content}</Text>
      ) : (
        <Text style={styles.emptyText}>남겨진 내용이 없어요.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 18,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 28,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: color.purple[700],
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  quote: {
    color: color.purple[300],
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 36,
    marginBottom: 10,
  },
  content: {
    color: semanticColor.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 30,
  },
  emptyText: {
    color: semanticColor.textMuted,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 26,
  },
});