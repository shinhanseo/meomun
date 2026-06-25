import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';
import { ArchiveHeader } from '../components/shared/ArchiveHeader';
import { ArchiveNavigationBar } from '../components/shared/ArchiveNavigationBar';
import type { ArchiveSort } from '../types/archive.types';

export function PlaceArchiveScreen() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<ArchiveSort>('latest');

  const handleCloseSearch = () => {
    setKeyword('');
    setIsSearchOpen(false);
  };

  return (
    <View style={styles.container}>
      <ArchiveHeader
        isSearchOpen={isSearchOpen}
        keyword={keyword}
        onChangeKeyword={setKeyword}
        onOpenSearch={() => setIsSearchOpen(true)}
        onCloseSearch={handleCloseSearch}
      />
      <ArchiveNavigationBar
        activeTab="place"
        sort={sort}
        onChangeSort={setSort}
      />
      <Text style={styles.title}>장소별 보관함</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    color: semanticColor.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 80,
  },
});
