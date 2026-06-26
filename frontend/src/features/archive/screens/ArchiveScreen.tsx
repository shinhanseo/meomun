import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { semanticColor } from '../../../shared/constants/color';
import { AllArchiveContent } from '../components/all/AllArchiveContent';
import { EmotionArchiveContent } from '../components/emotion/EmotionArchiveContent';
import { MonthlyArchiveContent } from '../components/monthly/MonthlyArchiveContent';
import { PlaceArchiveContent } from '../components/place/PlaceArchiveContent';
import { ArchiveHeader } from '../components/shared/ArchiveHeader';
import { ArchiveNavigationBar } from '../components/shared/ArchiveNavigationBar';
import type { ArchiveSort, ArchiveTab } from '../types';

export function ArchiveScreen() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ArchiveTab>('all');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<ArchiveSort>('latest');
  const contentAnimation = useRef(new Animated.Value(1)).current;

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    contentAnimation.setValue(0);
    Animated.timing(contentAnimation, {
      duration: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [activeTab, contentAnimation]);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setKeyword('');
    setIsSearchOpen(false);
  };

  const handleChangeMonth = useCallback((year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }, []);

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
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        sort={sort}
        onChangeSort={setSort}
        showSort={activeTab !== 'emotion'}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentAnimation,
            transform: [
              {
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        {activeTab === 'all' && (
          <AllArchiveContent keyword={keyword} sort={sort} />
        )}
        {activeTab === 'monthly' && (
          <MonthlyArchiveContent
            year={selectedYear}
            month={selectedMonth}
            keyword={keyword}
            sort={sort}
            onChangeMonth={handleChangeMonth}
          />
        )}
        {activeTab === 'place' && (
          <PlaceArchiveContent keyword={keyword} sort={sort} />
        )}
        {activeTab === 'emotion' && (
          <EmotionArchiveContent />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticColor.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
