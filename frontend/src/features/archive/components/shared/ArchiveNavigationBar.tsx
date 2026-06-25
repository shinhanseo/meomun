import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ArchiveStackParamList } from '../../../../app/navigation/ArchiveStackNavigator';
import { semanticColor } from '../../../../shared/constants/color';
import type { ArchiveSort, ArchiveTab } from '../../types/archive.types';

interface ArchiveNavigationBarProps {
  activeTab: ArchiveTab;
  sort: ArchiveSort;
  onChangeSort: (sort: ArchiveSort) => void;
  showSort?: boolean;
}

const ARCHIVE_TABS: {
  label: string;
  value: ArchiveTab;
  routeName: keyof ArchiveStackParamList;
}[] = [
  {
    label: '전체',
    value: 'all',
    routeName: 'ArchiveHome',
  },
  {
    label: '월별',
    value: 'monthly',
    routeName: 'MonthlyArchive',
  },
  {
    label: '장소별',
    value: 'place',
    routeName: 'PlaceArchive',
  },
  {
    label: '감정별',
    value: 'emotion',
    routeName: 'EmotionArchive',
  },
];

const SORT_OPTIONS: {
  label: string;
  value: ArchiveSort;
}[] = [
  {
    label: '최신순',
    value: 'latest',
  },
  {
    label: '오래된순',
    value: 'oldest',
  },
];

type ArchiveNavigationProp = NativeStackNavigationProp<ArchiveStackParamList>;

export function ArchiveNavigationBar({
  activeTab,
  sort,
  onChangeSort,
  showSort = true,
}: ArchiveNavigationBarProps) {
  const navigation = useNavigation<ArchiveNavigationProp>();
  const [isSortOpen, setIsSortOpen] = useState(false);

  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? '최신순';

  const handlePressTab = (tab: (typeof ARCHIVE_TABS)[number]) => {
    setIsSortOpen(false);

    if (tab.value === activeTab) {
      return;
    }

    navigation.navigate(tab.routeName);
  };

  const handlePressSort = (nextSort: ArchiveSort) => {
    onChangeSort(nextSort);
    setIsSortOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {ARCHIVE_TABS.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <Pressable
              key={tab.value}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.tabActive,
                pressed && styles.pressed,
              ]}
              onPress={() => handlePressTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showSort && (
        <View style={styles.sortWrapper}>
          <Pressable
            style={({ pressed }) => [
              styles.sortButton,
              pressed && styles.pressed,
            ]}
            onPress={() => setIsSortOpen((prev) => !prev)}
          >
            <Text style={styles.sortText}>{selectedSortLabel}</Text>
            <SlidersHorizontal color="#7C6FD6" size={15} strokeWidth={2.3} />
          </Pressable>

          {isSortOpen && (
            <View style={styles.sortMenu}>
              {SORT_OPTIONS.map((option) => {
                const isSelected = option.value === sort;

                return (
                  <Pressable
                    key={option.value}
                    style={({ pressed }) => [
                      styles.sortOption,
                      pressed && styles.sortOptionPressed,
                    ]}
                    onPress={() => handlePressSort(option.value)}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        isSelected && styles.sortOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>

                    {isSelected && (
                      <Check color="#7C6FD6" size={15} strokeWidth={2.4} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  tabs: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 18,
    minWidth: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabText: {
    color: semanticColor.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#5E4B9A',
  },
  pressed: {
    opacity: 0.72,
  },
  sortWrapper: {
    position: 'relative',
  },
  sortButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: 14,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sortText: {
    color: '#5E4B9A',
    fontSize: 13,
    fontWeight: '800',
  },
  sortMenu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE7F3',
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 112,
    paddingVertical: 6,
    position: 'absolute',
    right: 0,
    top: 46,
    shadowColor: '#8A6BD1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    zIndex: 20,
  },
  sortOption: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  sortOptionPressed: {
    backgroundColor: '#F7F3FF',
  },
  sortOptionText: {
    color: semanticColor.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  sortOptionTextSelected: {
    color: '#5E4B9A',
  },
});
