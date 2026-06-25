import { Search, X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { semanticColor } from '../../../../shared/constants/color';

interface ArchiveHeaderProps {
  isSearchOpen: boolean;
  keyword: string;
  onChangeKeyword: (keyword: string) => void;
  onOpenSearch: () => void;
  onCloseSearch: () => void;
}

export function ArchiveHeader({
  isSearchOpen,
  keyword,
  onChangeKeyword,
  onOpenSearch,
  onCloseSearch,
}: ArchiveHeaderProps) {
  const searchTranslateX = useRef(new Animated.Value(28)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isSearchOpen) {
      searchTranslateX.setValue(28);
      searchOpacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(searchTranslateX, {
        toValue: 0,
        duration: 190,
        useNativeDriver: true,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 190,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSearchOpen, searchOpacity, searchTranslateX]);

  if (isSearchOpen) {
    return (
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: searchOpacity,
            transform: [{ translateX: searchTranslateX }],
          },
        ]}
      >
        <View style={styles.searchInputBox}>
          <Search color="#8E849F" size={21} strokeWidth={2.2} />

          <TextInput
            value={keyword}
            autoFocus
            placeholder="제목, 장소, 기록을 검색해보세요"
            placeholderTextColor="#A8A1B8"
            returnKeyType="search"
            style={styles.searchInput}
            onChangeText={onChangeKeyword}
          />

          <Pressable
            hitSlop={10}
            style={styles.closeButton}
            onPress={onCloseSearch}
          >
            <X color="#8E849F" size={20} strokeWidth={2.4} />
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>보관함</Text>
        <Text style={styles.subtitle}>
          내가 머문 모든 순간들을 모아봤어요.
        </Text>
      </View>

      <Pressable
        hitSlop={12}
        style={({ pressed }) => [
          styles.searchButton,
          pressed && styles.searchButtonPressed,
        ]}
        onPress={onOpenSearch}
      >
        <Search color="#6F6296" size={24} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 22,
  },
  title: {
    color: '#5E4B9A',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  searchButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 2,
    width: 44,
  },
  searchButtonPressed: {
    opacity: 0.7,
  },
  searchContainer: {
    paddingBottom: 22,
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  searchInputBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE7F3',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: semanticColor.textPrimary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
});
