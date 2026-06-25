import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';
import { ArchiveHeader } from '../components/shared/ArchiveHeader';
import { ArchiveNavigationBar } from '../components/shared/ArchiveNavigationBar';
import type { ArchiveSort } from '../types/archive.types';

export function ArchiveScreen() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<ArchiveSort>('latest');

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

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
        onOpenSearch={handleOpenSearch}
        onCloseSearch={handleCloseSearch}
      />

      <ArchiveNavigationBar
        activeTab="all"
        sort={sort}
        onChangeSort={setSort}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
});
