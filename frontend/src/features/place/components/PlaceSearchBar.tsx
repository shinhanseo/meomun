import { Search, X } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';

interface PlaceSearchBarProps {
  query: string;
  onChangeQuery: (query: string) => void;
  onClear: () => void;
}

export function PlaceSearchBar({
  query,
  onChangeQuery,
  onClear,
}: PlaceSearchBarProps) {
  return (
    <View style={styles.container}>
      <Search color={semanticColor.textMuted} size={20} strokeWidth={2.2} />

      <TextInput
        autoFocus
        value={query}
        placeholder="장소를 검색해보세요"
        placeholderTextColor={semanticColor.textMuted}
        returnKeyType="search"
        style={styles.input}
        onChangeText={onChangeQuery}
      />

      {query.length > 0 && (
        <Pressable hitSlop={10} style={styles.clearButton} onPress={onClear}>
          <X color={semanticColor.textMuted} size={18} strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: semanticColor.surface,
    borderColor: semanticColor.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 52,
    paddingHorizontal: 16,
  },
  input: {
    color: semanticColor.textPrimary,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  clearButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
});
