import { Search, X } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';

interface EmotionArchiveDetailSearchBarProps {
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
}

export function EmotionArchiveDetailSearchBar({
  keyword,
  onChangeKeyword,
}: EmotionArchiveDetailSearchBarProps) {
  return (
    <View style={styles.listPanel}>
      <View style={styles.searchBox}>
        <Search color="#9B8BC0" size={19} strokeWidth={2.2} />
        <TextInput
          value={keyword}
          placeholder="기록 검색"
          placeholderTextColor="#A8A1B8"
          style={styles.searchInput}
          returnKeyType="search"
          onChangeText={onChangeKeyword}
        />
        {keyword.length > 0 && (
          <Pressable hitSlop={8} onPress={() => onChangeKeyword('')}>
            <X color="#A8A1B8" size={17} strokeWidth={2.4} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    marginTop: 6,
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 30,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE7F3',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: semanticColor.textPrimary,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    padding: 0,
  },
});
